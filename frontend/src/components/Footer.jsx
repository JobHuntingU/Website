
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/Logo_1.svg';
import { Linkedin, Twitter, Instagram, Mail, Phone, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/job-hunting-university/' },
    // { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    // { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/JobHuntingU' }
  ];

  return (
    <footer className="border-t bg-muted text-muted-foreground">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="JobHuntingU"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Combining high-energy community support with cutting-edge AI strategies to help you land your dream role, faster.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</span>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm transition-colors duration-200 hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social Column */}
          <div className="space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Get in Touch</span>
            <div className="space-y-3">
              <a
                href="mailto:jerry@jobhuntingu.com"
                className="flex items-center space-x-2 text-sm transition-colors duration-200 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                <span>jerry@jobhuntingu.com</span>
              </a>
              <a
                href="tel:+1647202-8777"
                className="flex items-center space-x-2 text-sm transition-colors duration-200 hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                <span>+1 (647) 202-8777</span>
              </a>
              <div className="flex space-x-4 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all duration-200 hover:text-foreground hover:scale-110"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between space-y-4 border-t pt-8 text-sm md:flex-row md:space-y-0">
          <p>© {currentYear} JobHuntingU. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="transition-colors duration-200 hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors duration-200 hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
