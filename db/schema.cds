using {
    cuid,
    managed,
    sap.common.CodeList as CodeList
} from '@sap/cds/common';

namespace db;

type myUUID : String(36);

aspect History {
    ID : myUUID;
}

aspect MyData {
    title : String(32);
    type  : String(1);
}

aspect SVData {
    @cds.api.ignore
    @assert.notNull: false
    validFrom : Timestamp not null;

    @cds.api.ignore
    @assert.notNull: false
    validTo   : Timestamp not null;
}

aspect Version {
    version         : Integer default 1;
    sequenceVersion : Integer default 1;
}

aspect Status {
    status : Association to one DataStatuses;
}

entity Statuses : CodeList {
    key code : String(3);
}

entity DataStatuses {
    key data   : Association to one Data;
    status : Association to one Statuses;
}

entity Data : cuid, managed, MyData, SVData, Version {
        status : Association to one DataStatuses on status.data.ID = ID;
}

entity DataHistory : History, managed, MyData, SVData, Version {
        status : Association to one DataStatuses on status.data.ID = ID;
}

entity DataTempStorage : History, managed, MyData {

}
