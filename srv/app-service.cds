using db from '../db/schema';

@path    : '/app'
@requires: 'any'
service AppService {
    view MasterDataA as
        select from MasterData
        where
            type = 'A';

    entity MasterData as projection on db.MasterData;
    entity DataHistory as projection on db.DataHistory;
    entity TestData as projection on db.TestData;
    entity TestDataHistory as projection on db.TestDataHistory;
}
