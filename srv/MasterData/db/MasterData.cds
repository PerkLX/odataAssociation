using {
  sap.common.CodeList,  
} from '@sap/cds/common';

namespace MasterDataDb;

entity Divisions {
  key division : String(20);
      name: String(20);
}

entity Test {
  key ID: UUID;
    name: String(20);
}

entity Sponsor {
  key ID: UUID;
    name: String(20);
    description: String(20);
}
