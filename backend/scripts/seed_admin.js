
require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const adminEmail = 'jerry@jobhuntingu.com';
const adminPassword = 'Slavaslava11!3';

async function seed() {
  try {
    console.log('Starting database update and seeding...');

    // 1. Create Admins Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create Page Content Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS page_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_name VARCHAR(100) NOT NULL,
        section_name VARCHAR(100) NOT NULL,
        content_key VARCHAR(100) NOT NULL,
        content_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY (page_name, section_name, content_key)
      )
    `);

    // 3. Add status to contact_form if it doesn't exist
    try {
      await pool.execute(`ALTER TABLE contact_form ADD COLUMN status VARCHAR(50) DEFAULT 'new'`);
      console.log('Added status column to contact_form.');
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('Status column already exists in contact_form.');
      } else {
        console.warn('Could not add status column (table might not exist yet):', err.message);
      }
    }

    // 4. Seed Admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    try {
      await pool.execute(
        'INSERT INTO admins (email, password, role) VALUES (?, ?, ?)',
        [adminEmail, hashedPassword, 'superadmin']
      );
      console.log(`✅ Admin user ${adminEmail} created successfully.`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log(`Admin user ${adminEmail} already exists.`);
      } else {
        throw err;
      }
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
