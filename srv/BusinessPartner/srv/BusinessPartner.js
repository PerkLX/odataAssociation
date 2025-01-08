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

  this.on(
    ['READ', 'PATCH'],
    [...manyTables.map((el) => `${el}.drafts`), 'BusinessPartners.drafts'],
    async (req) => {
      const tx = cds.transaction(req);
      const externalService = await cds.connect.to('MasterData');
      const draftEntity = await tx.run(req.query);

      if (!draftEntity || draftEntity.length === 0) return draftEntity;

      const draftEntityKeys = Array.isArray(draftEntity)
        ? Object.keys(draftEntity[0])
        : Object.keys(draftEntity);

      if (draftEntityKeys.length === 0) return draftEntity;

      for (const expandKey of Object.values(expandMap)) {
        const { entity, localField, externalField, selectFields } = expandKey;

        const processDraftEntity = async (draftEl) => {
          if (draftEl[localField] && new Set(draftEntityKeys).has(localField)) {
            const externalData = await externalService.run(
              SELECT.one
                .from(entity)
                .where({ [externalField]: draftEl[localField] })
                .columns(selectFields)
            );

            const expandEntityName = findKeyByField(
              expandMap,
              'entity',
              entity
            );

            draftEl[localField] = externalData[externalField];
            draftEl[expandEntityName] = externalData;
          }
        };

        if (Array.isArray(draftEntity)) {
          for (const draftEl of draftEntity) {
            await processDraftEntity(draftEl);
          }
        } else {
          await processDraftEntity(draftEntity);
        }
      }

      return draftEntity;
    }
  );

  const findKeyByField = (map, field, value) =>
    Object.keys(map).find((key) => map[key][field] === value) || null;

  // this.on(
  //   ['READ', 'PATCH'],
  //   [...manyTables.map((el) => `${el}.drafts`), 'BusinessPartners.drafts'],
  //   async (req) => {
  //     const tx = cds.transaction(req);

  //     const draftEntity = await tx.run(req.query);

  //     if (draftEntity && draftEntity.length !== 0) {
  //       const externalService = await cds.connect.to('MasterData');

  //       const draftEntityKeys = Array.isArray(draftEntity)
  //         ? Object.keys(draftEntity[0])
  //         : Object.keys(draftEntity);

  //       if (Array.isArray(draftEntityKeys) && draftEntityKeys.length > 0) {
  //         for (const expandKey of Object.values(expandMap)) {
  //           if (Array.isArray(draftEntity)) {
  //             for (const draftEl of draftEntity) {
  //               if (
  //                 draftEl[expandKey.localField] &&
  //                 new Set(draftEntityKeys).has(expandKey.localField)
  //               ) {
  //                 const { entity, localField, externalField, selectFields } =
  //                   expandKey;

  //                 const externalData = await externalService.run(
  //                   SELECT.one
  //                     .from(entity)
  //                     .where({
  //                       [externalField]: draftEl[localField],
  //                     })
  //                     .columns(selectFields)
  //                 );

  //                 const expandEntityName = findKeyByField(
  //                   expandMap,
  //                   'entity',
  //                   expandKey.entity
  //                 );

  //                 draftEl[localField] = externalData[externalField];
  //                 draftEl[expandEntityName] = externalData;
  //               }
  //             }
  //           }

  //           if (
  //             !Array.isArray(draftEntity) &&
  //             draftEntity[expandKey.localField] &&
  //             new Set(draftEntityKeys).has(expandKey.localField)
  //           ) {
  //             const { entity, localField, externalField, selectFields } =
  //               expandKey;

  //             const externalData = await externalService.run(
  //               SELECT.one
  //                 .from(entity)
  //                 .where({
  //                   [externalField]: draftEntity[localField],
  //                 })
  //                 .columns(selectFields)
  //             );

  //             const expandEntityName = findKeyByField(
  //               expandMap,
  //               'entity',
  //               expandKey.entity
  //             );

  //             draftEntity[localField] = externalData[externalField];
  //             draftEntity[expandEntityName] = externalData;
  //           }
  //         }
  //       }
  //     }
  //     return draftEntity;
  //   }
  // );

  // const findKeyByField = (map, field, value) => {
  //   for (const key in map) {
  //     if (map[key][field] === value) {
  //       return key;
  //     }
  //   }
  //   return null;
  // };
});
