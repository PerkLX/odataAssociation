
using {
  cuid,  
  managed
} from '@sap/cds/common';

namespace BusinessPartnerDb;
using { MasterData as MD } from '../srv/external/MasterData';

entity BusinessPartners : cuid {
  name: String;
  division_ID: String(20);
  division : Association to MD.Divisions on division.division = division_ID;
  test_ID: UUID;
  test: Association to MD.Test on test.ID = test_ID;
  Sponsors: Composition of many BusinessPartners.Sponsor on Sponsors.BusinessPartner = $self;
}

entity BusinessPartners.Sponsor {
  key ID: UUID;
    BusinessPartner_ID: UUID;
    Sponsor_ID: UUID;
    BusinessPartner: Association to BusinessPartners on BusinessPartner.ID = BusinessPartner_ID;
    Sponsor: Association to one MD.Sponsor on Sponsor.ID = Sponsor_ID;
}