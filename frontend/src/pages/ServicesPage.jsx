
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
      description: getContent('mastermind_description', 'We teach you how to fish in a high-energy, collaborative environment. Meeting multiple times a week, we show you exactly how to leverage modern AI tools to analyze and tailor your resume for specific roles, identify and connect with key stakeholders, and ultimately ace the interview.'),
      features: [
        'Multiple weekly meetings',
        'AI-powered resume optimization',
        'Stakeholder connection strategy',
        'Interview preparation'
      ],
      themeClass: 'card-mastermind',
      badgeClass: 'badge-mastermind',
      price: '$1,500',
      buttonText: 'Book a Discovery Call',
      buttonVariant: 'outline',
      hoverEffect: 'hover:-translate-y-2 hover:shadow-xl'
    },
    {
      id: 'vip',
      icon: Sparkles,
      title: getContent('vip_title', 'The VIP Tier'),
      subtitle: getContent('vip_subtitle', 'Done For You'),
      description: getContent('vip_description', 'This is our white-glove service. We take over the heavy lifting of the full job search cycle. While you focus on interview prep, our sophisticated, automated backend systems handle the rigorous work of processing job descriptions, sourcing roles, applying, and executing follow-ups. We run the pipeline; you take the interviews.'),
      features: [
        'Full job search automation',
        'Sophisticated backend systems',
        'Job description processing',
        'Automated follow-ups',
        'You focus on interviews'
      ],
      featured: true,
      themeClass: 'card-vip',
      badgeClass: 'badge-vip',
      price: '$3,500',
      buttonText: 'Book a Discovery Call',
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
            Choose the pathway that fits your goals. From collaborative training to white-glove automation, we have the ecosystem to get you hired.
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
