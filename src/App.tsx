import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { FeedPage } from './components/FeedPage';
import { ProfilePage } from './components/ProfilePage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { BookClubsPage } from './components/BookClubsPage';
import { ExplorePage } from './components/ExplorePage';
import { UserProfilePage } from './components/UserProfilePage';
import { Footer } from './components/Footer';
import { Button } from './components/ui/button';
import { BookOpen, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('feed');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);
  const { isAuthenticated, loading } = useAuth();

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check if user has visited before AND is not authenticated
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited && !isAuthenticated) {
      setShowLanding(false);
    }
  }, [isAuthenticated]);

  // If authenticated, skip landing page
  // If not authenticated (logged out), show landing page
  useEffect(() => {
    if (isAuthenticated) {
      setShowLanding(false);
      setShowLogin(false);
    } else {
      // User logged out - show landing page again
      setShowLanding(true);
      setShowLogin(false);
    }
  }, [isAuthenticated]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowLanding(false);
    setShowLogin(true);
  };

  const handleSignIn = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowLanding(false);
    setShowLogin(true);
  };

  const handleUsernameClick = (username: string) => {
    setViewingUsername(username);
    setCurrentPage('user-profile');
  };

  const handleBackFromUserProfile = () => {
    setViewingUsername(null);
    setCurrentPage('feed');
  };

  const renderCurrentPage = () => {
    if (currentPage === 'user-profile' && viewingUsername) {
      return <UserProfilePage username={viewingUsername} onBack={handleBackFromUserProfile} onUsernameClick={handleUsernameClick} />;
    }

    switch (currentPage) {
      case 'feed':
        return <FeedPage onUsernameClick={handleUsernameClick} />;
      case 'profile':
        return <ProfilePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'clubs':
        return <BookClubsPage />;
      case 'explore':
        return <ExplorePage onUsernameClick={handleUsernameClick} />;
      default:
        return <FeedPage onUsernameClick={handleUsernameClick} />;
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <p className="text-muted-foreground">Loading your reading journey...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated and past landing
  if (!isAuthenticated && !showLanding) {
    return <LoginPage />;
  }

  // Show landing page if user hasn't visited before
  if (showLanding) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Landing Page Navigation Bar */}
        <nav className="absolute top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">BookCafe</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={handleThemeToggle}>
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button onClick={handleGetStarted}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Cozy Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 dark:opacity-5">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-20 left-10 text-4xl"
        >
          📚
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-40 right-20 text-3xl"
        >
          ☕
        </motion.div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-40 left-32 text-3xl"
        >
          💡
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [0, -360],
            x: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-20 right-16 text-2xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-60 left-1/2 text-2xl"
        >
          🌙
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-60 right-1/3 text-3xl"
        >
          📖
        </motion.div>
      </div>

      {/* Floating Reading Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 z-40 hidden lg:block"
      >
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-full p-3 shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-muted-foreground">Reading streak: 23 days 🔥</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <AppContent />
    </AuthProvider>
  );
}