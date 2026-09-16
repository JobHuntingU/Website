
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Sparkles, CheckCircle2, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/hooks/useContent';

const ServicesPage = () => {
  const { getContent } = useContent('services');
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      id: 'mastermind',
      icon: Users,
      title: getContent('mastermind_title', 'The Mastermind'),
      subtitle: getContent('mastermind_subtitle', 'Done With You'),
      description: getContent('mastermind_description', 'Master the Hidden Job Market. Stop applying into the void. We work alongside you to build a personalized job-hunting "Machine" that fights fire with fire.'),
      features: [
        'Bypass the ATS: Learn to find and court the actual decision-makers so you aren\'t dealing with HR gatekeepers.',
        'The 11/10 Application: Master our exact AI and keyword workflows to ensure you rank at the top of the pile.',
        'Advanced Networking: Learn the "Law of Reciprocity" and use LinkedIn voice/video to land interviews without begging for favors.'
      ],
      themeClass: 'card-mastermind',
      badgeClass: 'badge-mastermind',
      price: '$1,500',
      buttonText: 'Apply for a Strategy Call',
      buttonVariant: 'outline',
      hoverEffect: 'hover:-translate-y-2 hover:shadow-xl'
    },
    {
      id: 'vip',
      icon: Sparkles,
      title: getContent('vip_title', 'The VIP Tier'),
      subtitle: getContent('vip_subtitle', 'Done For You'),
      description: getContent('vip_description', 'Your personal white-glove agency. Don\'t have 40 hours a week to job hunt? We build and run the Machine for you. You just sit back with a cup of coffee, review your dashboard, and show up to the interviews.'),
      features: [
        'We do the grunt work: Our account managers manually tailor your resume (15-20 keywords) and apply to high-tier roles within 72 hours of posting.',
        'Targeted Outreach: We build custom email marketing campaigns to court hiring managers on your behalf.',
        'Total Management: We track every metric, handle the follow-ups, and negotiate so you don\'t sell your time at a discount.'
      ],
      featured: true,
      themeClass: 'card-vip',
      badgeClass: 'badge-vip',
      price: '$3,500',
      buttonText: 'Apply for a Strategy Call',
      buttonVariant: 'default',
      hoverEffect: 'hover:-translate-y-2 hover:shadow-2xl scale-100 lg:scale-105 z-10'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`Services - JobHuntingU`}</title>
        <meta name="description" content="Explore JobHuntingU's service tiers: The Mastermind and The VIP Tier. Find the perfect path to transform your job search." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1560439450-6b5a38bc9dd5"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0 bg-black/70" />
        
        <div className="section-container relative z-10 text-center text-white pt-20">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
            {...fadeInUp}
          >
            Transform Your Job Search
          </motion.h1>
          <motion.p 
            className="text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto mb-12 text-white/90 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The modern job hunt requires fighting fire with fire. Choose your pathway to access the Hidden Job Market and secure your next high-paying role.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              onClick={scrollToServices}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 active:scale-[0.98] rounded-full px-8 h-14 text-lg"
            >
              Explore Our Services <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-24 bg-background">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold leading-snug mb-4">
              Our Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Two powerful tiers designed to meet you where you are and take you where you want to be.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`h-full ${service.hoverEffect} transition-all duration-500`}
                >
                  <div className={`plan-card ${service.themeClass}`}>
                    <div className="flex flex-col mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        {service.featured && (
                          <span className={`plan-badge ${service.badgeClass}`}>
                            Recommended
                          </span>
                        )}
                        {service.comingSoon && (
                          <span className={`plan-badge ${service.badgeClass}`}>
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{service.title}</h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-extrabold">{service.price}</span>
                        <span className="text-sm opacity-80 font-medium">/ package</span>
                      </div>
                      <span className="font-semibold text-lg opacity-90">{service.subtitle}</span>
                    </div>
                    
                    <p className="leading-relaxed mb-8 opacity-90 min-h-[8rem]">
                      {service.description}
                    </p>
                    
                    <div className="space-y-4 mb-8 flex-grow">
                      <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">What's included</h4>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start text-sm md:text-base font-medium">
                            <CheckCircle2 className="mr-3 h-5 w-5 shrink-0 opacity-80 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="plan-cta">
                      <Button 
                        size="lg" 
                        asChild
                        variant={service.buttonVariant}
                        className={`w-full font-bold text-base h-12 ${
                          service.buttonVariant === 'outline' 
                            ? 'bg-transparent border-2 border-current hover:bg-black/5 hover:text-current' 
                            : 'bg-foreground text-background hover:bg-foreground/90'
                        }`}
                      >
                        <Link to="/contact">{service.buttonText}</Link>
                      </Button>
                      {service.featured && (
                        <p className="text-sm text-muted-foreground mt-2">
                          (Note: We strictly cap our VIP clients to ensure an incredibly high success rate. Let's talk to see if you're a fit.)
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
