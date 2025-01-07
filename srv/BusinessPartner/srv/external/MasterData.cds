/* checksum : ce04bcebdefa30dbfe60a55eff207dbd */
@cds.external : true
@cds.persistence.skip : true
entity MasterData.Divisions {
  key division : String(20) not null;
  name : String(20);
};

@cds.external : true
@cds.persistence.skip : true
entity MasterData.Test {
  @Core.ComputedDefaultValue : true
  key ID : UUID not null;
  name : String(20);
};

@cds.external : true
@cds.persistence.skip : true
entity MasterData.Sponsor {
  @Core.ComputedDefaultValue : true
  key ID : UUID not null;
  name : String(20);
  description : String(20);
};

@cds.external : true
service MasterData {};

