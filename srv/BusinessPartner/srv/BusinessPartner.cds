using {BusinessPartnerDb as BP} from '../db/BusinessPartner';
using {MasterData as MD} from '../srv/external/MasterData';


@(path: '/Businesspartner')

service BusinessPartner {
    @odata.draft.enabled
    entity BusinessPartners as projection on BP.BusinessPartners;
    entity BusinessPartners.Sponsor as projection on BP.BusinessPartners.Sponsor;
    entity Divisions as projection on MD.Divisions;
    entity Test as projection on MD.Test; 
    entity Sponsor as projection on MD.Sponsor;
}