import React from 'react';
import { BookOpen, Coffee, Heart, Github, Twitter, Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function Footer() {
  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Help', href: '#' }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-card border-t border-border/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold text-primary">BookCafe</h3>
            </div>
            <p className="text-muted-foreground max-w-md">
              A cozy digital space for book lovers to connect, share, and discover their next great read. 
              Join our community of passionate readers from around the world.
            </p>
            <div className="flex items-center space-x-2 text-primary">
              <BookOpen className="h-4 w-4" />
              <Coffee className="h-4 w-4" />
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Read. Share. Connect.</span>
            </div>
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href={link.href}>{link.label}</a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social & Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-foreground">Stay Connected</h4>
            <p className="text-sm text-muted-foreground">
              Follow us on social media for the latest book recommendations and community updates.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-0 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      asChild
                    >
                      <a href={social.href} aria-label={social.label}>
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-border/50 mt-8 pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 BookCafe. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500 fill-current" />
                <span>for book lovers</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4 text-primary" />
              <span>Fueled by coffee and great stories</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cozy Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl">📚</div>
        <div className="absolute top-32 right-20 text-4xl">☕</div>
        <div className="absolute bottom-20 left-32 text-5xl">💡</div>
        <div className="absolute bottom-10 right-10 text-4xl">✨</div>
      </div>
    </footer>
  );
}