
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, ArrowRight, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContent } from '@/hooks/useContent';

import jerryImage from '../assets/Jerry Jay Hunter - Founder.webp';
import ashishImage from '../assets/Ashish.webp';
import hishaamImage from '../assets/Hishaam.webp';
import amritImage from '../assets/Amrit.webp';
import siriniImage from '../assets/sirini.webp';

const AboutPage = () => {
  const { getContent } = useContent('about');
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const testimonials = [
    {
      name: 'Maya Chen',
      role: 'Product Manager at Shopify',
      quote: 'JobHuntingU transformed my job search from a lonely grind into an empowering journey. The AI strategies cut my application time in half, and the community kept me motivated through every rejection.',
      avatar: 'MC',
      color: 'bg-primary'
    },
    {
      name: 'Raj Patel',
      role: 'Senior Developer at Amazon',
      quote: 'After 6 months of searching alone, I joined the VIP tier and landed 3 offers in 8 weeks. The personalized approach and automated outreach were game-changers.',
      avatar: 'RP',
      color: 'bg-secondary'
    },
    {
      name: 'Lucia Torres',
      role: 'Marketing Director at Lululemon',
      quote: 'The Mastermind program gave me the tools and confidence I needed. Jerry and the team genuinely care about your success, not just another sale.',
      avatar: 'LT',
      color: 'bg-accent-foreground'
    },
    {
      name: 'Kwame Asante',
      role: 'Data Analyst at Microsoft',
      quote: 'I was skeptical about AI in job searching, but the results speak for themselves. My interview rate tripled, and I finally understood how to stand out in a crowded market.',
      avatar: 'KA',
      color: 'bg-primary'
    }
  ];

  const team = [
    {
      name: 'Jerry J Hunter',
      title: 'Founder / CEO',
      bio: 'A visionary career strategist who realized traditional career coaching was broken. After stepping away from the standard corporate model, Jerry founded JobHuntingU to prove a core truth: no one should job hunt alone. He is the architect behind our "secret" job-hunting frameworks, designed to turn ordinary candidates into highly sought-after talent.',
      avatar: 'JH',
      image: jerryImage
    },
    {
      name: 'Hishaam K Pathan',
      title: 'Integrator / COO',
      bio: 'An operations mastermind focused on translating high-level vision into flawless execution. Hishaam bridges our high-energy human coaching programs with robust backend automation. He keeps the company’s internal engine running seamlessly so that our members can focus entirely on acing their interviews and landing their dream jobs.',
      avatar: 'HP',
      image: hishaamImage
    },
    {
      name: 'Sirini Kancharla',
      title: 'AI HR Business Partner',
      bio: 'A strategic HR specialist dedicated to bridging the gap between top talent and modern technology. Sirini leverages advanced AI resources to redefine the hiring, screening, and matching process, ensuring our candidates are always positioned perfectly in front of the right decision-makers.',
      avatar: 'SK',
      image: siriniImage
    },
    {
      name: 'Amrit Kaler',
      title: 'AI HR Business Partner',
      bio: 'A human resources innovator who champions our next generation of talent. Amrit leads and nurtures JobHuntingU\'s internship program, transforming eager learners into high-performing AI and marketing professionals. She acts as the primary mentor and operational guide, ensuring our interns get the hands-on, real-world tech experience that launches careers.',
      avatar: 'AK',
      image: amritImage
    },
    {
      name: 'Ashish Dawar',
      title: 'AI Automations Developer',
      bio: 'A creative systems architect who looks at a manual, repetitive process and immediately builds a way to automate it. Ashish designs and deploys the intelligent workflows, powered by OpenClaw, and Airtable. That fuel our VIP "Done For You" engine and scale our clients\' outreach effort.',
      avatar: 'AD',
      image: ashishImage
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`About JobHuntingU - Transforming the Job Search Experience`}</title>
        <meta name="description" content="Learn how JobHuntingU combines AI-powered strategies with community support to help job seekers land their dream roles faster. Meet our team and discover our mission." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1637622124152-33adfabcc923"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0 bg-black/75" />
        
        <div className="section-container relative z-10 text-center text-white pt-20">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
            {...fadeInUp}
          >
            {getContent('hero_title', "You shouldn't have to job hunt alone.")}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {getContent('hero_description', "The modern job search is exhausting, isolating, and fraught with rejection. JobHuntingU is here to change the narrative. We combine high-energy community support with cutting-edge AI strategies to help you land your dream role, faster.")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all duration-200 active:scale-[0.98]">
              <Link to="/contact">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-6">
                Born from a need for real support
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  JobHuntingU was founded by Jerry J. Hunter, a former corporate recruiter who spent years on the other side of the hiring table. After transitioning careers himself, Jerry experienced firsthand the brutal reality of modern job searching: endless applications disappearing into black holes, generic advice that didn't work, and the crushing isolation of rejection after rejection.
                </p>
                <p>
                  He realized that job seekers needed more than resume templates and interview tips. They needed a system that actually worked, community support to stay motivated, and cutting-edge tools to compete in an AI-driven hiring landscape.
                </p>
                <p>
                  In early 2026, Jerry launched JobHuntingU in Vancouver with a simple mission: combine the efficiency of AI automation with the power of human connection. What started as a small coaching practice has grown into a comprehensive ecosystem serving job seekers across Canada and beyond.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80" 
                alt="Team collaboration and support at JobHuntingU"
                className="rounded-2xl shadow-brand-lg w-full object-cover aspect-video"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
              Empowering the modern candidate
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-primary text-primary-foreground border-none shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 mb-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Immediate mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed">
                    Our current focus is Vancouver, where we're building a tight-knit community of 10-20 individuals who are serious about transforming their job search. We believe in quality over quantity, providing personalized attention and proven strategies that actually work.
                  </p>
                  <p className="leading-relaxed">
                    Every member receives hands-on support, access to our AI tools, and the accountability needed to stay consistent. We're not just teaching job search tactics — we're building a movement of empowered professionals who refuse to settle.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-secondary text-secondary-foreground border-none shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-foreground/10 mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Global vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed">
                    Our vision extends far beyond Vancouver. We're planning expansion to Toronto by late 2026, followed by major cities across Canada and eventually globally. The job search crisis isn't local — it's universal.
                  </p>
                  <p className="leading-relaxed">
                    We envision a world where no one has to navigate the job market alone, where AI amplifies human potential instead of replacing it, and where community support is the norm, not the exception. JobHuntingU will be the platform that makes this vision reality.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
              Success stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from real people who transformed their job search
            </p>
          </motion.div>

          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="break-inside-avoid"
              >
                <Card className="transition-all duration-300 hover:shadow-brand h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-12 w-12 rounded-xl">
                        <AvatarFallback className={`${testimonial.color} text-white rounded-xl`}>
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="leading-relaxed text-sm italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
              Meet the team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to your success
            </p>
          </motion.div>

          <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory">
            {team.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                className="flex-shrink-0 w-[320px] snap-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-brand-lg hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <Avatar className="h-24 w-24 rounded-2xl mb-4 mx-auto">
                      <AvatarImage
                        src={member.image}
                        alt={member.name}
                        className="object-cover object-top"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl rounded-2xl">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {member.title}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-center">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-6">
              Ready to transform your job search?
            </h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-8 text-primary-foreground/90">
              Join JobHuntingU today and discover how community support and AI-powered strategies can help you land your dream role faster than you ever thought possible.
            </p>
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all duration-200 active:scale-[0.98]">
              <Link to="/contact">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
