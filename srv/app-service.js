module.exports = function (srv) {
    const { Data, DataVersions, MasterData, DataHistory } = srv.entities;
    this.before('UPDATE', Data, async (req) => {
        const { ID } = req.data;
        const { title, type } = await SELECT.from(Data, ID);

        await INSERT.into(DataVersions).entries({
            data_ID: ID,
            title, type,
        });

        console.log(1);
    })

    // this.on('READ', '*', async () => {
    //     // await DELETE.from(Data);
    //     // await DELETE.from(DataVersions);
    //     await DELETE.from(MasterData);
    //     await DELETE.from(DataHistory);
    // })

    // this.before('UPDATE', MasterData, async (req) => {
    //     const { ID } = req.data
    //     console.log(1);
    //     const version = (await SELECT.from(MasterData, ID).columns('version')).version || 1;
    //     await UPDATE(MasterData, ID).with({ version: version + 1 });
    //     console.log(1);
    // })

}