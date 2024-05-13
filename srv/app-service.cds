using db from '../db/schema';

@path    : '/app'
@requires: 'any'
service AppService {
    entity Data         as projection on db.Data;
    entity DataVersions as projection on db.DataVersions;

    view DataTypeA as
        select from Data
        where
            type = 'A';

    entity MasterData as projection on db.MasterData;
    entity DataHistory as projection on db.DataHistory;
}
