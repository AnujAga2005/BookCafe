const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  coverImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['general', 'fiction', 'non-fiction', 'mystery', 'romance', 'sci-fi', 'fantasy', 'biography'],
    default: 'general',
    lowercase: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentBook: {
    bookId: String,
    title: String,
    author: String,
    coverImage: String,
    startDate: Date,
    endDate: Date
  },
  schedule: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly'],
    default: 'monthly'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  rules: [String],
  tags: [String]
}, {
  timestamps: true
});

// Virtual for member count
clubSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

module.exports = mongoose.model('Club', clubSchema);
