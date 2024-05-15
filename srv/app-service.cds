using db from '../db/schema';
using { sap.changelog as changeLog } from '@cap-js/change-tracking/index';


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
    entity DataTempStorage as projection on db.DataTempStorage;

    @readonly
    view ChangeView as select from changeLog.ChangeView;

    action updateData();
}
