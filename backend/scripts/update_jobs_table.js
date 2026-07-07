
require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');

async function updateJobsTable() {
  try {
    console.log('Updating jobs table for Google Jobs SEO...');

    // Drop old table if it's very different, or just modify
    // For safety, let's just make sure all columns exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        company VARCHAR(255) DEFAULT 'JobHuntingU',
        location VARCHAR(255) DEFAULT 'Remote',
        employment_type VARCHAR(50) DEFAULT 'INTERN',
        base_salary VARCHAR(100),
        salary_currency VARCHAR(10) DEFAULT 'CAD',
        date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valid_through DATETIME,
        is_active BOOLEAN DEFAULT TRUE,
        apply_url VARCHAR(255)
      )
    `);

    // Ensure status column exists in contact_form (leads) if not already there
    try {
        await pool.execute(`ALTER TABLE contact_form ADD COLUMN job_id INT DEFAULT NULL`);
    } catch (e) { /* ignore if exists */ }

    console.log('✅ Jobs table is ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update jobs table:', err);
    process.exit(1);
  }
}

updateJobsTable();
