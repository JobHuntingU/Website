import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Loader2, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/apiClient';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient.get('/api/blog');
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = ['All', ...new Set(posts.map(post => post.category).filter(Boolean))];

  useEffect(() => {
    let result = posts;

    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(result);
  }, [searchQuery, selectedCategory, posts]);

  return (
    <>
      <Helmet>
        <title>Careers & AI Job Search Insights Blog | JobHuntingU</title>
        <meta name="description" content="Explore expert job search guides, career acceleration tips, AI resume optimization hacks, and interview strategies from JobHuntingU." />
      </Helmet>

      {/* Header section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 text-center text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />
        <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="section-container relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Career resources
            </p>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight md:text-6xl">
              JobHuntingU Insights
            </h1>
            <p className="mx-auto text-lg leading-relaxed text-white/80 md:text-xl">
              Practical strategies for navigating your job search, preparing for interviews, and creating the momentum that leads to your next offer.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-white/65">
              <span>AI job search</span>
              <span className="hidden text-secondary sm:inline">•</span>
              <span>Career strategy</span>
              <span className="hidden text-secondary sm:inline">•</span>
              <span>Interview preparation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main listing */}
      <section className="py-16 bg-background">
        <div className="section-container max-w-6xl">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 h-12 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="rounded-full px-5 snap-center"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                      <Card className="h-full flex flex-col hover:shadow-brand transition-all duration-300 rounded-2xl overflow-hidden border bg-card text-card-foreground">
                        {post.image_url && (
                          <div className="relative aspect-video overflow-hidden">
                            <img 
                              src={post.image_url} 
                              alt={post.title} 
                              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                              {post.category}
                            </span>
                          </div>
                        )}
                        <CardHeader className="pt-6">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {new Date(post.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {post.read_time || '5 min read'}
                            </span>
                          </div>
                          <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                          <CardDescription className="text-sm line-clamp-3 mb-6 text-muted-foreground leading-relaxed">
                            {post.excerpt}
                          </CardDescription>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                                {post.author_name ? post.author_name[0] : 'J'}
                              </div>
                              <span className="text-xs font-medium text-foreground">{post.author_name || 'Jerry J Hunter'}</span>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="p-0 text-primary hover:text-primary/80 hover:bg-transparent font-semibold">
                              <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1">
                                Read Article <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border rounded-2xl bg-muted/10 max-w-md mx-auto">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">We couldn't find any articles matching your search criteria.</p>
                  <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear filters</Button>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </>
  );
};

export default BlogPage;
