const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // Required only if not using Google OAuth
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  favoriteGenres: [{
    type: String
  }],
  readingGoal: {
    type: Number,
    default: 12
  },
  booksRead: {
    type: Number,
    default: 0
  },
  currentlyReading: [{
    bookId: String,
    title: String,
    author: String,
    coverImage: String,
    pages: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now }
  }],
  readBooks: [{
    bookId: String,
    title: String,
    author: String,
    coverImage: String,
    pages: { type: Number, default: 0 },
    rating: Number,
    review: String,
    finishedAt: Date
  }],
  wantToRead: [{
    bookId: String,
    title: String,
    author: String,
    coverImage: String,
    pages: { type: Number, default: 0 },
    addedAt: { type: Date, default: Date.now }
  }],
  totalPagesRead: {
    type: Number,
    default: 0
  },
  badges: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  readingStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastLoginDate: Date
  },
  avgRating: {
    type: Number,
    default: 0
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  clubs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.toPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    displayName: this.displayName,
    avatar: this.avatar,
    bio: this.bio,
    favoriteGenres: this.favoriteGenres,
    booksRead: this.booksRead,
    readingGoal: this.readingGoal,
    badges: this.badges,
    followersCount: this.followers.length,
    followingCount: this.following.length,
    clubsCount: this.clubs.length,
    currentlyReading: this.currentlyReading,
    readBooks: this.readBooks,
    wantToRead: this.wantToRead,
    readingStreak: this.readingStreak,
    avgRating: this.avgRating,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
