using db from '../db/schema';
using { sap.changelog as changeLog } from '@cap-js/change-tracking/index';


@path    : '/app'
@requires: 'any'
service AppService {
    view DataA as
        select from Data
        where
            type = 'A';

    entity Data as projection on db.Data;
    entity DataHistory as projection on db.DataHistory;
    entity DataTempStorage as projection on db.DataTempStorage;

    @readonly
    view DataChangeView as select from changeLog.ChangeView;

    view DataWithStatuses as select from Data{
        *, status.status.name as status
    };

    entity DataStatuses as projection on db.DataStatuses;

    action updateData();
}
