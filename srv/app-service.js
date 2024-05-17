module.exports = function (srv) {
    const { Data, DataTempStorage, DataStatuses } = srv.entities;

    this.on(['UPDATE', 'CREATE', 'DELETE'], Data, async (req, next) => {
        if (!req.data.ID) {
            return next();
        }
        await INSERT.into(DataTempStorage).entries(getDataChange(req.event, req.data));
        await setStatus(req.data.ID, getDataChangeStatusCode(req.event));
        return req.data;

        async function getDataChange(event, reqData)  {
        switch (event) {
            case 'UPDATE': {
                return { ...(await SELECT.from(Data, reqData.ID)), ...req.data };
            }
            case 'DELETE': {
                return await SELECT.from(Data, req.data.ID);
            }
            case 'CREATE': {
                return reqData;
            }
        }
    }

    function getDataChangeStatusCode(event) {
        switch (event) {
            case 'UPDATE': {
                return 'TBU';
            }
            case 'DELETE': {
                return 'TBD';
            }
            case 'CREATE': {
                return 'TBC';
            }
        }
    }
    })

    this.on('changeData', async () => {
        const data = await SELECT.from(DataTempStorage);

        for (let d of data) {
            const { ID } = d;
            const { status_code } = await SELECT.one.from(DataStatuses).where({ data_ID: ID }).columns('status_code');
            switch (status_code) {
                case 'TBU': {
                    await UPDATE(Data, ID).with({ ...d });
                    await setStatus(ID, 'U');
                    break;
                };
                case 'U': {
                    await UPDATE(Data, ID).with({ ...d });
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
}