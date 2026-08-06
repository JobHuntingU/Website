const mysql = require('mysql2/promise');

async function migrate() {
  console.log('🚀 Starting Data Migration from Hostinger to VPS...');

  // Helper to wait for DB to be ready
  const waitForDb = async (config, retries = 10) => {
    for (let i = 0; i < retries; i++) {
      try {
        const conn = await mysql.createConnection(config);
        return conn;
      } catch (err) {
        if (i === retries - 1) throw err;
        console.log(`⏳ Waiting for database to be ready... (Attempt ${i + 1}/${retries})`);
        await new Promise(res => setTimeout(res, 3000)); // Wait 3 seconds
      }
    }
  };

  // 1. Connection to OLD Hostinger DB
  const oldDb = await mysql.createConnection({
    host: process.env.OLD_DB_HOST,
    user: process.env.OLD_DB_USER,
    password: process.env.OLD_DB_PASSWORD,
    database: process.env.OLD_DB_NAME
  });

  // 2. Connection to NEW VPS DB (Using Docker service name 'db' with retry)
  const newDb = await waitForDb({
    host: process.env.DB_HOST || 'db', 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const tables = ['jobs', 'blog_posts', 'admins', 'contact_form', 'page_content'];

  for (const table of tables) {
    console.log(`📦 Migrating table: ${table}...`);
    
    // 1. Get schema from old and create exact clone in new
    const [[{ 'Create Table': createSql }]] = await oldDb.execute(`SHOW CREATE TABLE ${table}`);
    await newDb.execute(`DROP TABLE IF EXISTS \`${table}\``);
    await newDb.execute(createSql);

    // 2. Fetch from old
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
