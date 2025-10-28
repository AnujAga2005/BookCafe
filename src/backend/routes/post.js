const express = require('express');
const Post = require('../models/Post');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get feed posts (ALL posts from everyone)
router.get('/feed', isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get ALL posts from everyone (changed to show all users' posts)
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName avatar')
      .populate('comments.author', 'username displayName avatar');

    const total = await Post.countDocuments({});

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch feed' } 
    });
  }
});

// Get all posts (explore)
router.get('/explore', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const filter = type ? { type } : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName avatar')
      .populate('comments.author', 'username displayName avatar');

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get explore posts error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch posts' } 
    });
  }
});

// Get user's posts
router.get('/user/:username', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ 
        error: { message: 'User not found' } 
      });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username displayName avatar')
      .populate('comments.author', 'username displayName avatar');

    res.json({ posts });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch posts' } 
    });
  }
});

// Create a new post
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { content, type, book, rating, progress, club, tags } = req.body;

    if (!content || !type) {
      return res.status(400).json({ 
        error: { message: 'Content and type are required' } 
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      type,
      book,
      rating,
      progress,
      club,
      tags
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username displayName avatar');

    res.status(201).json({ 
      message: 'Post created successfully',
      post: populatedPost 
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to create post' } 
    });
  }
});

// Like a post
router.post('/:postId/like', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ 
        error: { message: 'Post not found' } 
      });
    }

    res.json({ 
      message: 'Post liked',
      likesCount: post.likes.length 
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to like post' } 
    });
  }
});

// Unlike a post
router.post('/:postId/unlike', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ 
        error: { message: 'Post not found' } 
      });
    }

    res.json({ 
      message: 'Post unliked',
      likesCount: post.likes.length 
    });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to unlike post' } 
    });
  }
});

// Add comment to post
router.post('/:postId/comment', isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ 
        error: { message: 'Comment content is required' } 
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: {
          comments: {
            author: req.user._id,
            content,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('comments.author', 'username displayName avatar');

    if (!post) {
      return res.status(404).json({ 
        error: { message: 'Post not found' } 
      });
    }

    res.json({ 
      message: 'Comment added',
      comments: post.comments 
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to add comment' } 
    });
  }
});

// Delete post
router.delete('/:postId', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ 
        error: { message: 'Post not found' } 
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: { message: 'Not authorized to delete this post' } 
      });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to delete post' } 
    });
  }
});

module.exports = router;
