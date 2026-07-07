
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Loader2, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/useContent';
import apiClient from '@/lib/apiClient';

const ContactPage = () => {
  const { getContent } = useContent('contact');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    serviceInterest: '',
    message: '',
    preferredContactMethod: 'Email',
    website: '' // Honeypot field
  });
  const [errors, setErrors] = useState({});

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phoneNumber.trim() || !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Valid phone number is required';
    }
    
    if (!formData.serviceInterest) newErrors.serviceInterest = 'Please select a service';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, serviceInterest: value }));
    if (errors.serviceInterest) {
      setErrors(prev => ({ ...prev, serviceInterest: undefined }));
    }
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({ ...prev, preferredContactMethod: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Honeypot check: if 'website' is filled, it's likely a bot
    if (formData.website) {
      console.warn("Honeypot filled. Bot detected.");
      // Silently succeed to avoid alerting the bot
      toast({
        title: "Request Submitted!",
        description: "We'll be in touch shortly to schedule your discovery call.",
      });
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        jobTitle: '',
        serviceInterest: '',
        message: '',
        preferredContactMethod: 'Email',
        website: ''
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/api/contact', {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        job_title: formData.jobTitle,
        service: formData.serviceInterest,
        preferred_contact: formData.preferredContactMethod.toLowerCase(),
        message: formData.message
      });
      
      toast({
        title: "Request Submitted!",
        description: "We'll be in touch shortly to schedule your discovery call.",
      });
      
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        jobTitle: '',
        serviceInterest: '',
        message: '',
        preferredContactMethod: 'Email',
        website: ''
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "What happens during a discovery call?",
      answer: "During our 30-minute discovery call, we'll discuss your current career situation, your goals, and the challenges you're facing. We'll then outline how our ecosystem can specifically help you and determine which tier is the best fit."
    },
    {
      question: "How long is a discovery call?",
      answer: "Discovery calls are typically scheduled for 30 minutes. This gives us enough time to understand your needs without taking up too much of your day."
    },
    {
      question: "Is there a cost for a discovery call?",
      answer: "No, discovery calls are completely free and carry no obligation. They are simply an opportunity for us to see if we're a good fit for each other."
    },
    {
      question: "What should I prepare for the call?",
      answer: "Please have a copy of your current resume handy (even if it's outdated) and be ready to discuss your target roles and what you feel is currently holding you back in your search."
    },
    {
      question: "How will you follow up after the call?",
      answer: "After our call, we'll send you a summary email with our recommendations, pricing details for the suggested tier, and next steps if you decide to move forward."
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`Contact Us - Book a Discovery Call | JobHuntingU`}</title>
        <meta name="description" content="Book a free discovery call with JobHuntingU to explore how our AI-powered strategies and community can help you land your dream role." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3)' }}
        />
        <div className="hero-overlay absolute inset-0 bg-black/70" />
        
        <div className="section-container relative z-10 text-center text-white pt-20">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
            {...fadeInUp}
          >
            Let's Talk About Your Job Search
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Book a free discovery call with our team to explore how JobHuntingU can help you land your dream role.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Form Column */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 md:p-8 border">
                <h2 className="text-2xl font-bold mb-6">Request a Discovery Call</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field - hidden from users */}
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      tabIndex="-1" 
                      autoComplete="off" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        placeholder="Jane Doe"
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="jane@example.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number <span className="text-destructive">*</span></Label>
                      <Input 
                        id="phoneNumber" 
                        name="phoneNumber" 
                        type="tel" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        placeholder="+1 (555) 000-0000"
                        className={errors.phoneNumber ? "border-destructive" : ""}
                      />
                      {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Current Job Title / Role</Label>
                      <Input 
                        id="jobTitle" 
                        name="jobTitle" 
                        value={formData.jobTitle} 
                        onChange={handleChange} 
                        placeholder="e.g. Product Manager"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceInterest">What service are you interested in? <span className="text-destructive">*</span></Label>
                    <Select value={formData.serviceInterest} onValueChange={handleSelectChange}>
                      <SelectTrigger className={errors.serviceInterest ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a service tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Community Hub">The Community Hub (Coming Soon)</SelectItem>
                        <SelectItem value="Mastermind">The Mastermind (Done With You)</SelectItem>
                        <SelectItem value="VIP Tier">The VIP Tier (Done For You)</SelectItem>
                        <SelectItem value="Not Sure">Not Sure Yet</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.serviceInterest && <p className="text-sm text-destructive">{errors.serviceInterest}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Brief message about your goals (Optional)</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Tell us a bit about what you're looking for..."
                      className="min-h-[120px] resize-y"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">{formData.message.length}/500</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Preferred Contact Method <span className="text-destructive">*</span></Label>
                    <RadioGroup 
                      value={formData.preferredContactMethod} 
                      onValueChange={handleRadioChange}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Email" id="contact-email" />
                        <Label htmlFor="contact-email" className="font-normal cursor-pointer">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Phone" id="contact-phone" />
                        <Label htmlFor="contact-phone" className="font-normal cursor-pointer">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Either" id="contact-either" />
                        <Label htmlFor="contact-either" className="font-normal cursor-pointer">Either</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-2 mb-4">
                      <Label className="block text-base font-semibold text-primary">Complete Your Booking</Label>
                      <p className="text-sm text-muted-foreground">
                        To ensure we're fully prepared for your discovery call, please <span className="font-bold text-foreground">complete the form above</span> and <span className="font-bold text-foreground">select a time</span> on the calendar below. Once both are finished, click the button below to submit your request.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl overflow-hidden border">
                      <iframe 
                        src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2rpNGVZ2uM5hGbnYQl3vJbFqc9GDyOqb1k1ZBTF8doS2ifeuAA1ScBYupIFoMYeHdMGYZjAfJQ?gv=true" 
                        style={{ border: 0 }} 
                        width="100%" 
                        height="600" 
                        frameBorder="0"
                        title="Google Calendar Appointment Scheduling"
                      ></iframe>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold transition-all active:scale-[0.98]" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      "Request Discovery Call"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Info & FAQ Column */}
            <motion.div 
              className="lg:col-span-5 space-y-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email Us</p>
                      <a href={`mailto:${getContent('contact_email', 'jerry@jobhuntingu.com')}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {getContent('contact_email', 'jerry@jobhuntingu.com')}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Call Us</p>
                      <a href={`tel:${getContent('contact_phone', '+16472028777')}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {getContent('contact_phone', '+1 (647) 202-8777')}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p className="text-muted-foreground">
                        {getContent('contact_location', '319 W Hastings St Vancouver, BC, Canada')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t">
                  <p className="font-semibold mb-4">Follow Our Journey</p>
                  <div className="flex space-x-4">
                    <a href="https://www.linkedin.com/company/job-hunting-university/" aria-label="LinkedIn" className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground p-3 rounded-full transition-all duration-200">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="https://www.facebook.com/JobHuntingU" aria-label="Facebook" className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground p-3 rounded-full transition-all duration-200">
                      <Facebook className="h-5 w-5" />
                    </a>
                    {/* <a href="#" aria-label="Instagram" className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground p-3 rounded-full transition-all duration-200">
                      <Instagram className="h-5 w-5" />
                    </a> */}
                  </div>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="pt-8 border-t">
                <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
