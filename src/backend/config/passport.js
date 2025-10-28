const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    // Check if user registered with Google
    if (user.googleId && !user.password) {
      return done(null, false, { message: 'Please sign in with Google' });
    }

    // Validate password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      return done(null, user);
    }

    // Check if email already exists (user might have registered with email/password)
    const email = profile.emails[0].value;
    user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.avatar = user.avatar || profile.photos[0]?.value;
      await user.save();
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      googleId: profile.id,
      email: email.toLowerCase(),
      username: profile.displayName || email.split('@')[0],
      displayName: profile.displayName,
      avatar: profile.photos[0]?.value,
      bio: '',
      favoriteGenres: [],
      readingGoal: 12
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
  }));
} else {
  console.log('⚠️  Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file.');
}

module.exports = passport;
