import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Loader2, BookOpen, Share2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { marked } from 'marked';
import apiClient from '@/lib/apiClient';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiClient.get(`/api/blog/${slug}`);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
      .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center max-w-md px-4">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Article not found</h2>
        <p className="text-muted-foreground mb-6">The article you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/blog">Back to Insights</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | JobHuntingU Insights`}</title>
        <meta name="description" content={post.excerpt} />
        {/* Schema markup for Blog Article SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image_url,
            "datePublished": post.created_at,
            "author": {
              "@type": "Person",
              "name": post.author_name || "Jerry J Hunter",
              "url": "https://jobhuntingu.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "JobHuntingU",
              "logo": {
                "@type": "ImageObject",
                "url": "https://jobhuntingu.com/assets/Logo_1-B3L3Cz-_.svg"
              }
            }
          })}
        </script>
      </Helmet>

      <article className="py-12 bg-background min-h-screen">
        <div className="section-container max-w-3xl px-4">
          
          {/* Back link */}
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights
          </Link>

          {/* Header Metadata */}
          <div className="mb-8">
            <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-foreground">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-b py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
                  {post.author_name ? post.author_name[0] : 'J'}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{post.author_name || 'Jerry J Hunter'}</p>
                  <p className="text-xs text-muted-foreground">Author & Executive Coach</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {post.read_time || '5 min read'}
                </span>
                <button onClick={handleShare} className="hover:text-primary transition-colors flex items-center gap-1" aria-label="Share article">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.image_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-brand-lg">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Rich Content View */}
          <div 
            className="prose prose-slate dark:prose-invert max-w-none text-lg md:text-xl leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content || '') }}
          />

          {/* CTA Box inside article */}
          <div className="mt-16 p-8 rounded-2xl border bg-muted/30 border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Accelerate Your Career?</h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-base">
              Learn how we combine AI-driven tools with personalized job coaching and done-for-you systems to land you interview offers in 8-12 weeks.
            </p>
            <Button size="lg" asChild className="rounded-full px-8 h-12 font-bold shadow-md hover:shadow-lg">
              <Link to="/contact">Book a Free Strategy Session</Link>
            </Button>
          </div>

        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;
