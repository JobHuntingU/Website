
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await apiClient.get(`/api/jobs/${id}`);
        setJob(data);
      } catch (err) {
        console.error('Failed to fetch job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Job listing not found</h2>
        <Button asChild variant="outline">
          <Link to="/careers">Back to Careers</Link>
        </Button>
      </div>
    );
  }

  // Google Jobs Structured Data for single page
  const structuredData = {
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

  return (
    <>
      <Helmet>
        <title>{`${job.title} - Careers | JobHuntingU`}</title>
        <meta name="description" content={`Apply for the ${job.title} position at JobHuntingU.`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <section className="py-12 bg-muted/30">
        <div className="section-container max-w-4xl">
          <Link to="/careers" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
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
            <Button size="lg" asChild className="shrink-0">
              <a href="https://airtable.com/applgmrp1xg2aleCP/pag13CsBc8ydwnqJK/form" target="_blank" rel="noopener noreferrer">
                Apply for this position
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container max-w-4xl">
          <div className="prose prose-slate max-w-none">
            {/* Split by double newline for simple paragraph rendering if markdown parser not installed */}
            {job.description.split('\n\n').map((para, i) => (
              <p key={i} className="mb-4 text-lg leading-relaxed whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
          
          <div className="mt-16 pt-8 border-t text-center">
            <h3 className="text-xl font-bold mb-6">Interested in this role?</h3>
            <Button size="lg" asChild>
              <a href="https://airtable.com/applgmrp1xg2aleCP/pag13CsBc8ydwnqJK/form" target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobDetailPage;
