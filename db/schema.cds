using {
    cuid,
    managed
} from '@sap/cds/common';

namespace db;

type myUUID: String(36);

aspect History {
    ID: myUUID;
}

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
    testVersion: Integer default 1;
}

entity MasterData : cuid, MyData, SVData, versioned {

}

entity DataHistory : MyData, History, SVData, versioned {
}

entity TestData: cuid, MyData, SVData, versioned {

}

entity TestDataHistory : MyData, History, SVData, versioned {
}

entity DataTempStorage: MyData, History, versioned {

}