
require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');

const marketingJob = {
  title: 'AI Digital Marketing Intern',
  description: `The Mission

"No one should job hunt alone!"
At JobHuntingU, we help people land job offers at companies they love by eliminating the exhausting, manual grind of the modern job search. Our secret? We don't just 'search'—we architect. By mapping the entire job-hunting workflow into an automated engine, we eliminate manual friction to 10x our clients' interviews and put them directly in front of key decision-makers.
By taking care of the job hunt, our clients can focus on what actually matters in life. Founded out of the Centre for Social and Economic Innovation in downtown Vancouver, we are an impact-driven team making a tangible difference in people's lives. Now, we need a creative, AI-forward marketer to help us amplify our voice, run our group channels, and grow our community.

What You’ll Be Doing
As our AI Digital Marketing Intern, you won't just be making graphics—you’ll be building scalable marketing engines. You will combine human creativity with cutting-edge AI to execute multi-channel growth strategies:

• Short-Form Video & Visuals: Script, produce, and edit weekly video Reels and social media posts designed to convert viewers into community members.
• Content Engine & Blogging: Write SEO-optimized blog posts and publish high-converting monthly email newsletters that keep our audience engaged.
• Community Engagement: Actively nurture our social groups (Facebook & LinkedIn), post high-quality engaging content, manage comments, and welcome new members.
• Lead Generation: Implement our proven growth strategies to attract potential clients and community members into our ecosystem.
• AI-Powered Workflows: Use advanced AI suites (Gemini, Google AI Studio, ChatGPT, Claude) to accelerate copywriting, research, and campaign creation.

What We’re Looking For

• Pursuing or recently completed a degree/diploma in Marketing, Business, Communications, or a related field.
• Location: Fully Remote role, but we strongly prefer candidates based in the Greater Vancouver area.
• Foundational knowledge of digital marketing concepts (Social Media, SEO, Email Marketing, Content Creation).
• Excellent written communication skills—you know how to strike the right balance between professional authority and authentic empathy.
• High comfort level on camera or creating short-form video content (Reels/TikTok/Shorts).
• An AI-First Mindset: You are passionate about leveraging Artificial Intelligence. Familiarity with tools like Gemini, Google AI Studio, or ChatGPT is a huge plus, but an insatiable eagerness to learn is required!

What You’ll Gain

• Direct Path to Full-Time / Strong Reference: Outstanding performance during the 3 months can lead to a paid full-time offer with JobHuntingU or a stellar executive reference to launch your career.
• Live & Online Events: Opportunities to participate in our live local events (if based in Vancouver) or host online company events and workshops.
• Cutting-Edge Portfolio: Walk away with high-performing campaigns, published blogs, and proven lead-generation assets under your belt.
• Hands-on AI Mastery: Learn how to use next-generation AI workflows to do the work of a full marketing team in half the time.

Note: Our process and systems are heavily rooted in AI and LinkedIn Automation. Please ensure you have a basic understanding of what these tools do prior to interviewing.

Ready to build the future of career tech with us? Apply today!`,
  location: '100% Remote (Vancouver, BC area preferred)',
  apply_url: 'https://airtable.com/applgmrp1xg2aleCP/pagxL1UphQKHPkiWU/form'
};

const automationJobUrl = 'https://airtable.com/applgmrp1xg2aleCP/pagacwWfcrlVeR7zD/form';

async function update() {
  try {
    console.log('Updating job listings...');

    // Update Digital Marketing Job (assuming title matches)
    await pool.execute(
      'UPDATE jobs SET description = ?, location = ?, apply_url = ? WHERE title LIKE "%Marketing%"',
      [marketingJob.description, marketingJob.location, marketingJob.apply_url]
    );
    console.log('✅ AI Digital Marketing Intern updated.');

    // Update Automation Job URL
    await pool.execute(
      'UPDATE jobs SET apply_url = ? WHERE title LIKE "%Automation%"',
      [automationJobUrl]
    );
    console.log('✅ AI Automations Integrator URL updated.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Update failed:', err);
    process.exit(1);
  }
}

update();
