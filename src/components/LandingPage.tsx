import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BookOpen, Users, TrendingUp, Star, Coffee, Heart, MessageCircle, Award, Sparkles, ArrowRight, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function LandingPage({ onGetStarted, onSignIn, isDarkMode, onThemeToggle }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: "Join Book Clubs",
      description: "Connect with like-minded readers in cozy communities dedicated to your favorite genres.",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Track Your Reading",
      description: "Monitor your progress, set goals, and celebrate milestones with beautiful analytics.",
      color: "text-green-500"
    },
    {
      icon: MessageCircle,
      title: "Share Reviews",
      description: "Express your thoughts, share quotes, and discover new books through community recommendations.",
      color: "text-purple-500"
    },
    {
      icon: Award,
      title: "Earn Achievements",
      description: "Unlock badges, maintain reading streaks, and gamify your literary journey.",
      color: "text-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      username: "@bookworm_sarah",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1a7?w=32&h=32&fit=crop&crop=face",
      text: "BookCafe helped me discover my new favorite genre! The community here is so supportive and welcoming. 📚✨",
      books: 47
    },
    {
      name: "Marcus Johnson",
      username: "@lit_lover_marcus",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      text: "I've connected with amazing readers worldwide. Our sci-fi book club discussions are the highlight of my week!",
      books: 62
    },
    {
      name: "Elena Rodriguez",
      username: "@elena_reads",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face",
      text: "The reading analytics motivate me to read more. I've already hit my yearly goal and it's only September! 🎯",
      books: 38
    }
  ];

  const stats = [
    { number: "25K+", label: "Active Readers" },
    { number: "500+", label: "Book Clubs" },
    { number: "1M+", label: "Books Tracked" },
    { number: "4.9★", label: "Community Rating" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1739133087944-0a6311a2319b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGlicmFyeSUyMHJlYWRpbmclMjBub29rfGVufDF8fHx8MTc1ODg4MDA1NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Cozy reading space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Logo and Badge */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <BookOpen className="h-12 w-12 text-primary" />
                  <h1 className="text-4xl lg:text-5xl font-bold text-primary">BookCafe</h1>
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    Beta
                  </Badge>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant="outline" className="space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Your cozy corner of the literary world</span>
                  </Badge>
                </motion.div>
              </div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Where Every
                  <span className="text-primary block">Reader Belongs</span>
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl">
                  Connect with fellow book lovers, track your reading journey, and discover your next favorite story in our warm, welcoming community.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="text-lg px-8 py-6 space-x-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={onSignIn}
                  className="text-lg px-8 py-6 space-x-2 border-2 hover:bg-primary/5"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Login</span>
                </Button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl lg:text-3xl font-bold text-primary">{stat.number}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative min-h-[400px]">
                <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📚</div>
                    <h3 className="text-2xl font-bold text-foreground">Join the Story</h3>
                    <p className="text-muted-foreground">Where readers become friends</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <Badge variant="outline" className="space-x-1">
              <Coffee className="h-3 w-3" />
              <span>Everything you need</span>
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Your Literary Journey,
              <span className="text-primary block">Beautifully Organized</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From solo reading sessions to vibrant book club discussions, BookCafe provides all the tools you need to enrich your reading experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center ${feature.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="outline" className="space-x-1">
                  <Users className="h-3 w-3" />
                  <span>Community first</span>
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Connect with Readers
                  <span className="text-primary block">Around the World</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join book clubs, participate in discussions, and make lasting friendships with people who share your passion for great stories.
                </p>
              </div>

              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-4 border-border/50 bg-card/50 backdrop-blur-sm">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.username}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {testimonial.books} books
                            </Badge>
                          </div>
                          <p className="text-foreground">{testimonial.text}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758525866582-5c74fb7d9378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwcmVhZGluZyUyMGJvb2tzJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU4ODgwMDU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Friends reading together"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5 dark:opacity-3">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-32 left-20 text-6xl"
        >
          📚
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-64 right-32 text-4xl"
        >
          ☕
        </motion.div>
        <motion.div
          animate={{ 
            x: [0, 20, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-16 text-5xl"
        >
          💡
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [0, -360],
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-64 right-20 text-4xl"
        >
          ✨
        </motion.div>
      </div>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                Ready to Start Your
                <span className="text-primary block">Reading Adventure?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of book lovers who have already found their reading home at BookCafe. Your next great read is waiting for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="text-lg px-8 py-6 space-x-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <BookOpen className="h-5 w-5" />
                <span>Join BookCafe Free</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 space-x-2 border-2"
              >
                <Coffee className="h-5 w-5" />
                <span>Learn More</span>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground pt-8">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span>25K+ members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>No ads, ever</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}