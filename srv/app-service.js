module.exports = function (srv) {
    const { MasterData, DataHistory, TestData, TestDataHistory, DataTempStorage } = srv.entities;

    // this.on('READ', '*', async () => {
    //     // await DELETE.from(Data);
    //     // await DELETE.from(DataVersions);
    //     await DELETE.from(TestData);
    //     await DELETE.from(TestDataHistory);
    //     await DELETE.from(DataTempStorage);
    // })

    this.on('UPDATE', TestData, async (req, next) => {
        if (!req.data.ID) {
            next();
        }
        const tmp = await SELECT.from(TestData, req.data.ID);
        await INSERT.into(DataTempStorage).entries({ ...tmp, ...req.data });
    })

    this.on('updateData', async () => {
        const data = await SELECT.from(DataTempStorage);

        for (let d of data) {
            await UPDATE(TestData, d.ID).with(d);
            await DELETE.from(DataTempStorage, d.ID);
        }
    })

}