const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Load .env only if NOT running in Docker (Docker provides env via compose)
if (!process.env.DB_HOST) {
  require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
  });
}

const app = express();
const PORT = process.env.PORT || 3001;
const pool = require('./config/db');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- DYNAMIC DATABASE MIGRATION ---
(async () => {
  try {
    console.log(`Validating Database Connection to ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}...`);
    
    // Create Blog Posts Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        author_name VARCHAR(100) DEFAULT 'Jerry J Hunter',
        read_time VARCHAR(50) DEFAULT '5 min read',
        image_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Jobs Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) DEFAULT 'Remote',
        employment_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN') DEFAULT 'FULL_TIME',
        base_salary VARCHAR(100),
        salary_currency VARCHAR(10) DEFAULT 'CAD',
        date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valid_through DATE,
        is_active BOOLEAN DEFAULT TRUE,
        apply_url TEXT,
        company VARCHAR(255) DEFAULT 'JobHuntingU'
      )
    `);

    // Create Admins Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Page Content Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS page_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_name VARCHAR(100) NOT NULL,
        section_name VARCHAR(100) NOT NULL,
        content_key VARCHAR(100) NOT NULL,
        content_value TEXT,
        UNIQUE KEY idx_content (page_name, section_name, content_key)
      )
    `);

    // Create Contact Form Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contact_form (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        job_title VARCHAR(255),
        service VARCHAR(255),
        preferred_contact VARCHAR(50),
        message TEXT,
        job_id INT,
        status VARCHAR(50) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database Tables successfully synchronized.');
  } catch (err) {
    console.error('❌ Database migration failed:', err);
  }
})();

app.use(cors({
  origin: [
    'https://jobhuntingu.com',
    'https://www.jobhuntingu.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ]
}));
app.use(express.json());

// --- MIDDLEWARE ---
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.admin = decoded;
    next();
  });
};

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// --- AUTH ROUTES ---
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    const admin = rows[0];

    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '12h' });
      res.json({ token, admin: { email: admin.email, role: admin.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CONTENT MANAGEMENT ROUTES ---
app.get('/api/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM page_content');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/content', authenticateAdmin, async (req, res) => {
  const { page_name, section_name, content_key, content_value } = req.body;
  try {
    const sql = `
      INSERT INTO page_content (page_name, section_name, content_key, content_value)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)
    `;
    await pool.execute(sql, [page_name, section_name, content_key, content_value]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LEAD MANAGEMENT ROUTES ---
app.get('/api/admin/leads', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_form ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/leads/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.execute('UPDATE contact_form SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CAREERS / JOBS ROUTES ---
app.get('/api/jobs', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM jobs WHERE is_active = TRUE ORDER BY date_posted DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM jobs WHERE id = ? AND is_active = TRUE', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/jobs', authenticateAdmin, async (req, res) => {
  const { title, description, location, employment_type, base_salary, valid_through, apply_url } = req.body;
  try {
    const sql = `
      INSERT INTO jobs (title, description, location, employment_type, base_salary, valid_through, apply_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(sql, [
      title, 
      description, 
      location || 'Remote', 
      employment_type || 'INTERN', 
      base_salary || null, 
      valid_through || null,
      apply_url || null
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SITEMAP (Dynamic for Google indexing) ---
app.get('/api/sitemap.xml', async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT id FROM jobs WHERE is_active = TRUE ORDER BY date_posted DESC');
    const [blogs] = await pool.execute('SELECT slug FROM blog_posts ORDER BY created_at DESC');
    
    const baseUrl = 'https://jobhuntingu.com';
    const today = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
  <url><loc>${baseUrl}/about</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>
  <url><loc>${baseUrl}/services</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>
  <url><loc>${baseUrl}/contact</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>
  <url><loc>${baseUrl}/blog</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>
  <url><loc>${baseUrl}/careers</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>`;

    // Dynamic Jobs
    jobs.forEach(job => {
      xml += `
  <url>
    <loc>${baseUrl}/careers/${job.id}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>`;
    });

    // Dynamic Blogs
    blogs.forEach(blog => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>`;
    });

    xml += '\n</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// --- JOB FEEDS (Indeed, LinkedIn, etc.) ---
app.get('/api/feeds/indeed', async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT * FROM jobs WHERE is_active = TRUE ORDER BY date_posted DESC');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>JobHuntingU</publisher>
  <publisherurl>https://jobhuntingu.com</publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`;

    jobs.forEach(job => {
      xml += `
  <job>
    <title><![CDATA[${job.title}]]></title>
    <date><![CDATA[${new Date(job.date_posted).toUTCString()}]]></date>
    <referencenumber><![CDATA[${job.id}]]></referencenumber>
    <url><![CDATA[https://jobhuntingu.com/careers/${job.id}]]></url>
    <company><![CDATA[${job.company || 'JobHuntingU'}]]></company>
    <city><![CDATA[${job.location.split('/')[1]?.trim() || 'Vancouver'}]]></city>
    <state><![CDATA[BC]]></state>
    <country><![CDATA[CA]]></country>
    <description><![CDATA[${job.description}]]></description>
    <salary><![CDATA[${job.base_salary ? `${job.base_salary} ${job.salary_currency}` : ''}]]></salary>
    <jobtype><![CDATA[${job.employment_type.toLowerCase()}]]></jobtype>
  </job>`;
    });

    xml += `
</source>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating feed');
  }
});

// --- PUBLIC BLOG ENDPOINTS ---
app.get('/api/blog', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Blog post not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN BLOG ENDPOINTS ---
app.post('/api/admin/blog', authenticateAdmin, async (req, res) => {
  const { id, title, slug, excerpt, content, category, author_name, read_time, image_url } = req.body;
  try {
    if (id) {
      // Update
      const sql = `
        UPDATE blog_posts 
        SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author_name = ?, read_time = ?, image_url = ?
        WHERE id = ?
      `;
      await pool.execute(sql, [title, slug, excerpt, content, category || 'General', author_name || 'Jerry J Hunter', read_time || '5 min read', image_url, id]);
    } else {
      // Create
      const sql = `
        INSERT INTO blog_posts (title, slug, excerpt, content, category, author_name, read_time, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.execute(sql, [title, slug, excerpt, content, category || 'General', author_name || 'Jerry J Hunter', read_time || '5 min read', image_url]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/blog/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PUBLIC CONTACT ROUTE ---
app.post('/api/contact', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      job_title,
      service,
      preferred_contact,
      message
    } = req.body;

    const sql = `
      INSERT INTO contact_form
      (full_name, email, phone, job_title, service, preferred_contact, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      full_name,
      email,
      phone || null,
      job_title || null,
      service || null,
      preferred_contact || 'email',
      message || null
    ];

    const [result] = await pool.execute(sql, values);

    // Integrate with Systeme.io
    try {
      const systemeApiKey = process.env.SYSTEME_API_KEY;
      if (systemeApiKey) {
        // Split full_name into first and last name
        const nameParts = (full_name || '').trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const systemeResponse = await fetch('https://api.systeme.io/api/contacts', {
          method: 'POST',
          headers: {
            'X-API-Key': systemeApiKey,
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            fields: [
              {
                slug: 'first_name',
                value: firstName
              },
              {
                slug: 'surname',
                value: lastName
              },
              {
                "slug": "phone_number",
                "value": phone || ''
              }
            ]
          })
        });

        if (!systemeResponse.ok) {
          const errorData = await systemeResponse.json();
          console.error('Systeme.io API Error:', errorData);
        } else {
          console.log('Successfully synced to Systeme.io');
        }
      }
    } catch (systemeErr) {
      console.error('Failed to sync with Systeme.io:', systemeErr.message);
      // We don't want to fail the whole request if Systeme.io sync fails
    }

    res.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});