import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from "@/assets/hero-background.webp";
import {
  ArrowRight,
  Users,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useContent } from '@/hooks/useContent';

const HomePage = () => {
  const { getContent } = useContent('home');
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const stats = [
    { label: 'Avg. interview rate increase', value: '3.2x' },
    { label: 'Time to first offer', value: '8–12 weeks' },
    { label: 'Active job seekers helped', value: '500+' },
    { label: 'Offer success rate (VIP)', value: '78%' },
  ];

  const servicesPreview = [
    {
      id: 'community',
      icon: TrendingUp,
      title: 'The Community Hub',
      subtitle: 'Coming June 27th!',
      description: 'Join our exclusive Skool community. Access expert guidance and engage with peers.',
      themeClass: 'card-community',
      badgeClass: 'badge-community',
    },
    {
      id: 'mastermind',
      icon: Users,
      title: 'The Mastermind',
      subtitle: 'Done With You',
      description: 'Collaborative training where we teach you cutting-edge AI tools for your job search.',
      themeClass: 'card-mastermind',
      badgeClass: 'badge-mastermind',
    },
    {
      id: 'vip',
      icon: Sparkles,
      title: 'The VIP Tier',
      subtitle: 'Done For You',
      description: 'Our premium white-glove service. We build and manage your automated backend systems.',
      featured: true,
      themeClass: 'card-vip',
      badgeClass: 'badge-vip',
    }
  ];

  const testimonials = [
    {
      name: 'Maya Chen',
      role: 'Product Manager',
      quote:
        'I went from months of silence to multiple interviews within weeks. The system actually works.',
      avatar: 'MC',
    },
    {
      name: 'Raj Patel',
      role: 'Software Engineer',
      quote:
        'The VIP automation completely changed my job search. I stopped guessing and started getting interviews.',
      avatar: 'RP',
    },
    {
      name: 'Lucia Torres',
      role: 'Marketing Lead',
      quote:
        'Structured, practical, and motivating. It feels like having a job search operating system.',
      avatar: 'LT',
    },
  ];

  return (
    <>
      <Helmet>
        <title>JobHuntingU — AI-Powered Job Search System</title>
        <meta
          name="description"
          content="Land interviews faster with AI-powered job search systems, coaching, and automation."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0 bg-black/70" />

        <div className="section-container relative z-10 text-center text-white pt-20">
          <motion.h1
            {...fadeUp}
            className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            {getContent('hero_title', 'Stop applying blindly.')}
            <br />
            {getContent('hero_subtitle', 'Start getting interviews.')}
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8 text-white/90"
          >
            {getContent('hero_description', 'JobHuntingU combines AI automation + coaching + community to transform your job search into a structured system that actually works.')}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Button asChild size="lg">
              <Link to="/contact">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="ghost">
              <Link to="/about" aria-label="Learn more about JobHuntingU mission and team">Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-muted/30">
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl md:text-4xl font-bold mb-2">{s.value}</p>
              <p className="text-sm md:text-base text-muted-foreground font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROBLEM / VALUE */}
      <section className="py-24 bg-background">
        <div className="section-container grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
              {getContent('problem_title', 'The job search is broken.')}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                {getContent('problem_p1', "Most candidates waste months sending resumes into a black hole. No feedback. No strategy. No system. The modern job search is exhausting, isolating, and fraught with rejection.")}
              </p>
              <p>
                {getContent('problem_p2', "We fix that by turning your job search into a repeatable, AI-assisted pipeline that focuses on outcomes—not effort. We combine high-energy community support with cutting-edge AI strategies to help you land your dream role, faster.")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-none shadow-2xl bg-muted/20">
              <CardTitle className="text-2xl font-bold mb-6">What changes with us</CardTitle>
              <ul className="space-y-4">
                {[
                  'Fewer applications, higher quality',
                  'Interview-first targeting strategy',
                  'AI-assisted resume optimization',
                  'Clear weekly execution system',
                  'Peer community accountability',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-lg font-medium">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 bg-muted/50">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Your job search, rebuilt.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the pathway that fits your goals. From collaborative training to white-glove automation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {servicesPreview.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col h-full transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className={`plan-card ${service.themeClass} flex-grow p-8 rounded-2xl flex flex-col`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      {service.featured && (
                        <span className={`plan-badge ${service.badgeClass} text-xs font-bold uppercase tracking-wider`}>
                          Recommended
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-1">{service.title}</h3>
                    <p className="text-sm font-semibold mb-4 opacity-90 uppercase tracking-wide">{service.subtitle}</p>
                    
                    <p className="text-base leading-relaxed mb-8 opacity-90 flex-grow">
                      {service.description}
                    </p>
                    
                    <div className="mt-auto">
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/contact">
                          Book a Discovery Call <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Real success stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our system has transformed the careers of job seekers across different industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full p-8 border-none bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{t.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg leading-tight">{t.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed italic text-foreground/80">
                    "{t.quote}"
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <div className="section-container relative z-10 text-center text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to change your job search?
            </h2>
            <p className="text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto font-medium">
              Join JobHuntingU and turn your job hunt into a structured system that
              actually gets results.
            </p>

            <Button asChild size="lg" className="bg-secondary text-black">
              <Link to="/contact">
                Start Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;