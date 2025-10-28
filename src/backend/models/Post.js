const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['review', 'update', 'recommendation', 'discussion'],
    default: 'update'
  },
  book: {
    bookId: String,
    title: String,
    author: String,
    coverImage: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  progress: {
    current: Number,
    total: Number
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ club: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
