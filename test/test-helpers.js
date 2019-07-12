function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        trafus_expenses,
        trafus_categories
        RESTART IDENTITY CASCADE;
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE trafus_expenses_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE trafus_categories_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('trafus_expenses_id_seq', 0)`),
        trx.raw(`SELECT setval('trafus_categories_id_seq', 0)`),
      ])
    )
  )
}

function seedCategories(db, categories){
    return db.transaction(async trx=>{
        await trx.into('trafus_categories').insert(categories)
    })
}
module.exports = {
    cleanTables,
    seedCategories
}