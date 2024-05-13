using {
    cuid,
    managed
} from '@sap/cds/common';

namespace db;

aspect MyData {
    title : String(32);
    type  : String(1);
}

aspect SVData {
    // @cds.api.ignore
    @assert.notNull: false
    validFrom : Timestamp not null;

    // @cds.api.ignore
    @assert.notNull: false
    validTo   : Timestamp not null;
}

aspect versioned {
    version : Integer default 1;
}

entity Data : MyData, managed {
    key ID       : Integer;
        versions : Composition of many DataVersions
                       on versions.data = $self;
}

entity DataVersions : cuid, MyData {
    data    : Association to one Data;
    version : Integer;
}

entity MasterData : cuid, MyData, SVData, versioned {

}

entity DataHistory : MyData, SVData, versioned {
    ID     : String(36);
}
