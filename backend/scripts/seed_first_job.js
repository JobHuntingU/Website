
require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');

const jobData = {
  title: 'AI Automations Integrator',
  description: `At Job Hunting U, we're not just watching the AI revolution—we're harnessing it to change the world, one job seeker at a time. We're in a massive growth phase, transforming our Sales, Marketing, and HR operations from the ground up with next-generation AI and automation.

This isn't your typical internship. This is a front-row seat to the future of business. You won't be fetching coffee; you'll be building the engine of our company's next chapter. It's an incredible opportunity to get the hands-on, real-world experience that schools can't teach and that companies demand.

What You'll Be Doing:
- Pioneer the integration of cutting-edge AI, automation, and Natural Language Processing (NLP) tools across our core business functions.
- Architect and deploy intelligent workflows that directly impact our sales funnels, marketing outreach, and HR processes.
- Collaborate with our fun, impact-driven team to identify operational bottlenecks and design creative, automated solutions.
- Build a portfolio of real-world AI implementation projects that will define your career.

This Is The Perfect Opportunity For You If:
- You are insatiably curious about how AI actually works in a real business.
- You're a natural problem-solver who sees a manual process and immediately thinks, "I can automate that."
- You are a self-starter who thrives on learning and taking ownership in a fast-paced environment.
- You want to join a positive, remote-first team that believes in working healthy and living wealthy.

The Opportunity:
This is a 3-month internship designed as a launchpad. Our goal is to invest in you, give you unparalleled experience, and for the right candidate, extend a full-time, paid offer upon successful completion of the term.`,
  location: 'Remote / Vancouver',
  employment_type: 'INTERN'
};

async function seed() {
  try {
    await pool.execute(
      'INSERT INTO jobs (title, description, location, employment_type) VALUES (?, ?, ?, ?)',
      [jobData.title, jobData.description, jobData.location, jobData.employment_type]
    );
    console.log('✅ First job seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
