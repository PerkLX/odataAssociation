using {MasterDataDb as MD} from '../db/MasterData';

@(path: '/MasterData')

service MasterData {
    entity Divisions as select from MD.Divisions;
    entity Test as projection on MD.Test;
    entity Sponsor as projection on MD.Sponsor;
}