module.exports = function (srv) {
    const { Data, DataHistory, DataTempStorage, DataStatuses } = srv.entities;

    // this.on('READ', '*', async () => {
    //     await DELETE.from(Data);
    //     await DELETE.from(DataHistory);
    //     await DELETE.from(DataTempStorage);
    // })

    this.on('UPDATE', Data, async (req, next) => {
        if (!req.data.ID) {
            next();
        }
        const tmp = await SELECT.from(Data, req.data.ID);
        await INSERT.into(DataTempStorage).entries({ ...tmp, ...req.data });
        await UPDATE(DataStatuses).where({ data_ID: req.data.ID }).with({ status_code: 'TBU' });
    })


    this.on('updateData', async () => {
        const data = await SELECT.from(DataTempStorage);

        for (let d of data) {
            await UPDATE(Data, d.ID).with(d);
            await DELETE.from(DataTempStorage, d.ID);
            await UPDATE(DataStatuses).where({ data_ID: d.ID }).with({ status_code: 'U' });
        }
    })

    this.after('CREATE', Data, async (data, req) => {
        await INSERT.into(DataStatuses).entries({ data_ID: data.ID, status_code: 'N' });
    })
}