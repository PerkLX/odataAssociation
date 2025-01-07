module.exports = cds.service.impl(async function businessPartnerService() {
  /**
   * External entities read for masterData service
   */
  this.on('READ', 'Divisions', async (req) => {
    const md = await cds.connect.to('MasterData');
    return md.run(req.query);
  });

  this.on('READ', 'Sponsor', async (req) => {
    const md = await cds.connect.to('MasterData');
    return md.run(req.query);
  });

  this.on('READ', 'Test', async (req) => {
    const md = await cds.connect.to('MasterData');
    return md.run(req.query);
  });

  const manyTables = ['BusinessPartners.Sponsor'];

  const expandMap = {
    division: {
      entity: 'Divisions',
      localField: 'division_ID',
      externalField: 'division',
      data: null,
      selectFields: [],
    },
    test: {
      entity: 'Test',
      localField: 'test_ID',
      externalField: 'ID',
      data: null,
      selectFields: [],
    },
    Sponsor: {
      entity: 'Sponsor',
      localField: 'Sponsor_ID',
      externalField: 'ID',
      data: null,
      selectFields: [],
    },
  };

  this.on('READ', [...manyTables, 'BusinessPartners'], async (req) => {
    const tx = cds.transaction(req);
    const externalService = await cds.connect.to('MasterData');

    const mainEntity = await tx.run(req.query);

    if (!mainEntity) return mainEntity;

    if (req._queryOptions && req._queryOptions.$expand) {
      const expandOptions = req._queryOptions.$expand
        ? Array.from(
            req._queryOptions.$expand.matchAll(/(?<=,|^)([^\(,]+)(?=\()/g),
            (match) => match[1].trim()
          )
        : [];

      expandOptions.forEach((expandKey) => {
        const expandMatch = req._queryOptions.$expand.match(
          new RegExp(`${expandKey}\\(.*?\\)`)
        );
        if (expandMatch) {
          const selectString = expandMatch[0].match(
            /\$select=([a-zA-Z0-9,_]+)/
          );
          if (selectString) {
            const selectedFields = selectString[1]
              .split(',')
              .map((field) => field.trim());
            if (expandMap[expandKey]) {
              expandMap[expandKey].selectFields = selectedFields;
            }
          }
        }
      });

      for (const expandKey of expandOptions) {
        if (expandMap[expandKey]) {
          const { entity, localField, externalField, selectFields } =
            expandMap[expandKey];

          const ids = Array.isArray(mainEntity)
            ? [...new Set(mainEntity.map((el) => el[localField]))]
            : [mainEntity[localField]];

          const externalData = await externalService.run(
            SELECT.from(entity)
              .where({ [externalField]: { in: ids } })
              .columns(selectFields)
          );

          expandMap[expandKey].data = Object.fromEntries(
            externalData.map((item) => [item[externalField], item])
          );
        }
      }

      Array.isArray(mainEntity)
        ? mainEntity.forEach((el) => {
            for (const expandKey of expandOptions) {
              if (expandMap[expandKey]) {
                const { localField, data } = expandMap[expandKey];
                el[expandKey] = data[el[localField]];
              }
            }
          })
        : expandOptions.forEach((expandKey) => {
            if (expandMap[expandKey]) {
              const { localField, data } = expandMap[expandKey];
              mainEntity[expandKey] = data[mainEntity[localField]];
            }
          });
    }

    return mainEntity;
  });
});
