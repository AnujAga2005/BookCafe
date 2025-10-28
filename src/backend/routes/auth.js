const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register with email and password
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, displayName } = req.body;

    // Validation
    if (!email || !password || !username || !displayName) {
      return res.status(400).json({ 
        error: { message: 'All fields are required' } 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: { message: 'Password must be at least 6 characters' } 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: { message: 'Email or username already exists' } 
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      username,
      displayName,
      bio: '',
      favoriteGenres: [],
      readingGoal: 12
    });

    // Log in the user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: { message: 'Registration successful but login failed' } 
        });
      }

      res.status(201).json({
        message: 'User registered successfully',
        user: user.toPublicProfile()
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: { message: 'Registration failed' } 
    });
  }
});

// Login with email and password
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        error: { message: 'Authentication error' } 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        error: { message: info.message || 'Invalid credentials' } 
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: { message: 'Login failed' } 
        });
      }

      res.json({
        message: 'Login successful',
        user: user.toPublicProfile()
      });
    });
  })(req, res, next);
});

// Google OAuth - Initiate
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ 
      error: { 
        message: 'Google OAuth is not configured. Please set up Google OAuth credentials in the backend .env file or use email/password registration.' 
      } 
    });
  }
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })(req, res, next);
});

// Google OAuth - Callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.FRONTEND_URL + '/login?error=auth_failed'
  }),
  (req, res) => {
    // Successful authentication
    res.redirect(process.env.FRONTEND_URL + '/feed');
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        error: { message: 'Logout failed' } 
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          error: { message: 'Session destruction failed' } 
        });
      }
      
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      error: { message: 'Not authenticated' } 
    });
  }

  res.json({ user: req.user.toPublicProfile() });
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({ 
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user.toPublicProfile() : null
  });
});

module.exports = router;
