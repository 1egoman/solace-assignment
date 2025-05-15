const pg = require('pg');

async function migrate() {
  const conn = new pg.Client({
    connectionString: 'postgresql://postgres:password@localhost/solaceassignment',
  });

  await conn.connect()
   
  const result = await conn.query('select specialties from advocates');

  for (const { specialties } of result.rows) {
    const parsed = JSON.parse(specialties);
    for (const entry of parsed) {
      console.log('ENTRY', entry);
      await conn.query('insert into specialties(label) values ($1) on conflict do nothing', [entry]);
    }
  }
   
  await conn.end()
}
migrate();
