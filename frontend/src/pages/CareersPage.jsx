
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/apiClient';

// Helper to strip markdown for clean text previews
const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/[#*`_~\-+]/g, '') // strip simple formatting characters
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // replace links [text](url) with just text
    .trim();
};

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiClient.get('/api/jobs');
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Function to generate Google Jobs Structured Data (JSON-LD)
  const renderStructuredData = (job) => {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "datePosted": job.date_posted,
      "validThrough": job.valid_through || "2026-12-31T23:59:59Z",
      "employmentType": job.employment_type || "INTERN",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "JobHuntingU",
        "sameAs": "https://jobhuntingu.com"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location || "Remote",
          "addressRegion": "BC",
          "addressCountry": "CA"
        }
      }
    };
    return JSON.stringify(schema);
  };

  return (
    <>
      <Helmet>
        <title>Careers - Join the AI Revolution | JobHuntingU</title>
        <meta name="description" content="Explore career opportunities at JobHuntingU. Join our remote-first team and help us transform the job search experience with AI." />
        {jobs.map(job => (
          <script key={`schema-${job.id}`} type="application/ld+json">
            {renderStructuredData(job)}
          </script>
        ))}
      </Helmet>

      {/* Hero */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="section-container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Build the Future of AI with Us
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We're looking for hungry, innovative talent to help us change how the world finds work.
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="py-20 bg-background">
        <div className="section-container max-w-4xl">
          <h2 className="text-3xl font-bold mb-10">Current Openings</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" /> {job.employment_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> Posted {new Date(job.date_posted).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button asChild>
                        <a href={job.apply_url || "https://airtable.com/applgmrp1xg2aleCP/pag13CsBc8ydwnqJK/form"} target="_blank" rel="noopener noreferrer">
                          Apply Now
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground line-clamp-3 mb-4 text-sm md:text-base leading-relaxed">
                      {stripMarkdown(job.description)}
                    </div>
                    <Link to={`/careers/${job.id}`} className="text-primary font-semibold flex items-center gap-1 hover:underline">
                      Read full description <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}

              {jobs.length === 0 && (
                <div className="text-center py-20 border rounded-xl bg-muted/20">
                  <p className="text-muted-foreground">No active job listings at the moment. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CareersPage;
