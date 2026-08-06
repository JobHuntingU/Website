const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function migrate() {
  console.log('🚀 Starting Data Migration from Hostinger to VPS...');

  // 1. Connection to OLD Hostinger DB
  const oldDb = await mysql.createConnection({
    host: process.env.OLD_DB_HOST,
    user: process.env.OLD_DB_USER,
    password: process.env.OLD_DB_PASSWORD,
    database: process.env.OLD_DB_NAME
  });

  // 2. Connection to NEW VPS DB
  const newDb = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const tables = ['jobs', 'blog_posts', 'admins'];

  for (const table of tables) {
    console.log(`📦 Migrating table: ${table}...`);
    
    // Fetch from old
    const [rows] = await oldDb.execute(`SELECT * FROM ${table}`);
    
    if (rows.length === 0) {
      console.log(`⚠️  No data in ${table}, skipping.`);
      continue;
    }

    // Clear new (careful!)
    await newDb.execute(`DELETE FROM ${table}`);

    // Insert into new
    for (const row of rows) {
      const keys = Object.keys(row);
      const values = Object.values(row);
      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
      await newDb.execute(sql, values);
    }
    
    console.log(`✅ Finished ${table} (${rows.length} rows)`);
  }

  console.log('🎉 Migration Complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
