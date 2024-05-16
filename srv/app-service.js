module.exports = function (srv) {
    const { Data, DataTempStorage, DataStatuses } = srv.entities;

    this.on('UPDATE', Data, async (req, next) => {
        if (!req.data.ID) {
            next();
        }
        const tmp = await SELECT.from(Data, req.data.ID);
        const data = { ...tmp, ...req.data }
        await registerDataChange(data, 'TBU');
        return data;
    })

    this.on('DELETE', Data, async (req, next) => {
        if (!req.data.ID) {
            next();
        }
        const tmp = await SELECT.from(Data, req.data.ID);
        const data = { ...tmp };
        await registerDataChange(data, 'TBD');
        return;
    })

    this.on('CREATE', Data, async (req, next) => {
        if (!req.data.ID) {
            next();
        }
        const data = { ...req.data };
        await registerDataChange(data, 'TBC');
        return data;
    })


    this.on('updateData', async () => {
        const data = await SELECT.from(DataTempStorage);

        for (let d of data) {
            const { ID } = d;
            const { status_code } = await SELECT.one.from(DataStatuses).where({ data_ID: ID }).columns('status_code');
            switch (status_code) {
                case 'TBU':
                case 'U': {
                    await UPDATE(Data, ID).with({ ...d });
                    await setStatus(ID, 'U');
                    break;
                };
                case 'TBD': {
                    await DELETE.from(Data, ID);
                    await setStatus(ID, 'D');
                    break;
                };
                case 'TBC': {
                    await INSERT.into(Data).entries({ ...d });
                    await setStatus(ID, 'N');
                    break;
                }
            }
            await DELETE.from(DataTempStorage, ID);
        }
    })

    async function setStatus(data_ID, status_code) {
        const exist = await SELECT.one.from(DataStatuses).where({ data_ID });
        if (exist) {
            await UPDATE(DataStatuses).where({ data_ID }).with({ status_code });
            return;
        }
        await INSERT.into(DataStatuses).entries({ data_ID, status_code });
        return;
    }

    async function registerDataChange(data, status_code) {
        await INSERT.into(DataTempStorage).entries(data);
        await setStatus(data.ID, status_code);
        return;
    }
}