const express = require('express');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get user profile by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');

    if (!user) {
      return res.status(404).json({ 
        error: { message: 'User not found' } 
      });
    }

    res.json({ user: user.toPublicProfile() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch user' } 
    });
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { displayName, bio, favoriteGenres, readingGoal, avatar } = req.body;
    
    const updates = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (favoriteGenres !== undefined) updates.favoriteGenres = favoriteGenres;
    if (readingGoal !== undefined) updates.readingGoal = readingGoal;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );

    res.json({ 
      message: 'Profile updated successfully',
      user: user.toPublicProfile() 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to update profile' } 
    });
  }
});

// Follow a user
router.post('/:userId/follow', isAuthenticated, async (req, res) => {
  try {
    const userIdToFollow = req.params.userId;
    const currentUserId = req.user._id;

    if (userIdToFollow === currentUserId.toString()) {
      return res.status(400).json({ 
        error: { message: 'Cannot follow yourself' } 
      });
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ 
        error: { message: 'User not found' } 
      });
    }

    // Add to following list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userIdToFollow }
    });

    // Add to followers list
    await User.findByIdAndUpdate(userIdToFollow, {
      $addToSet: { followers: currentUserId }
    });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to follow user' } 
    });
  }
});

// Unfollow a user
router.post('/:userId/unfollow', isAuthenticated, async (req, res) => {
  try {
    const userIdToUnfollow = req.params.userId;
    const currentUserId = req.user._id;

    // Remove from following list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userIdToUnfollow }
    });

    // Remove from followers list
    await User.findByIdAndUpdate(userIdToUnfollow, {
      $pull: { followers: currentUserId }
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to unfollow user' } 
    });
  }
});

// Add book to currently reading
router.post('/reading/current', isAuthenticated, async (req, res) => {
  try {
    const { bookId, title, author, coverImage, pages } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          currentlyReading: {
            bookId,
            title,
            author,
            coverImage,
            pages: pages || 0,
            progress: 0,
            startedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json({ 
      message: 'Book added to currently reading',
      currentlyReading: user.currentlyReading 
    });
  } catch (error) {
    console.error('Add currently reading error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to add book' } 
    });
  }
});

// Update reading progress
router.put('/reading/current/:bookId', isAuthenticated, async (req, res) => {
  try {
    const { progress } = req.body;
    
    const user = await User.findOneAndUpdate(
      { 
        _id: req.user._id,
        'currentlyReading.bookId': req.params.bookId
      },
      {
        $set: { 'currentlyReading.$.progress': progress }
      },
      { new: true }
    );

    res.json({ 
      message: 'Progress updated',
      currentlyReading: user.currentlyReading 
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to update progress' } 
    });
  }
});

// Mark book as read
router.post('/reading/finished', isAuthenticated, async (req, res) => {
  try {
    const { bookId, title, author, coverImage, rating, review, pages } = req.body;

    // Remove from currently reading
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { currentlyReading: { bookId } }
    });

    // Add to read books and increment count + pages
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          readBooks: {
            bookId,
            title,
            author,
            coverImage,
            pages: pages || 0,
            rating,
            review,
            finishedAt: new Date()
          }
        },
        $inc: { 
          booksRead: 1,
          totalPagesRead: pages || 0
        }
      },
      { new: true }
    );

    res.json({ 
      message: 'Book marked as read',
      readBooks: user.readBooks,
      booksRead: user.booksRead,
      totalPagesRead: user.totalPagesRead
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to mark book as read' } 
    });
  }
});

// Add to want to read
router.post('/reading/wishlist', isAuthenticated, async (req, res) => {
  try {
    const { bookId, title, author, coverImage, pages } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          wantToRead: {
            bookId,
            title,
            author,
            coverImage,
            pages: pages || 0,
            addedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json({ 
      message: 'Book added to wishlist',
      wantToRead: user.wantToRead 
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to add to wishlist' } 
    });
  }
});

// Remove book from currently reading
router.delete('/reading/current/:bookId', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { currentlyReading: { bookId: req.params.bookId } } },
      { new: true }
    );

    res.json({ 
      message: 'Book removed from currently reading',
      currentlyReading: user.currentlyReading 
    });
  } catch (error) {
    console.error('Remove from currently reading error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to remove book' } 
    });
  }
});

// Remove book from finished
router.delete('/reading/finished/:bookId', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $pull: { readBooks: { bookId: req.params.bookId } },
        $inc: { booksRead: -1 }
      },
      { new: true }
    );

    res.json({ 
      message: 'Book removed from finished',
      readBooks: user.readBooks 
    });
  } catch (error) {
    console.error('Remove from finished error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to remove book' } 
    });
  }
});

// Remove book from wishlist
router.delete('/reading/wishlist/:bookId', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wantToRead: { bookId: req.params.bookId } } },
      { new: true }
    );

    res.json({ 
      message: 'Book removed from wishlist',
      wantToRead: user.wantToRead 
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to remove book' } 
    });
  }
});

// Update login streak (called on each login/app open)
router.post('/streak/update', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastLogin = user.readingStreak.lastLoginDate 
      ? new Date(user.readingStreak.lastLoginDate) 
      : null;
    
    if (lastLogin) {
      lastLogin.setHours(0, 0, 0, 0);
    }

    let updates = {};

    if (!lastLogin || today.getTime() !== lastLogin.getTime()) {
      // Check if yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin && lastLogin.getTime() === yesterday.getTime()) {
        // Consecutive day - increment streak
        const newStreak = user.readingStreak.current + 1;
        updates = {
          'readingStreak.current': newStreak,
          'readingStreak.longest': Math.max(newStreak, user.readingStreak.longest),
          'readingStreak.lastLoginDate': today
        };
      } else if (!lastLogin || lastLogin.getTime() < yesterday.getTime()) {
        // Streak broken or first login - reset to 1
        updates = {
          'readingStreak.current': 1,
          'readingStreak.longest': Math.max(1, user.readingStreak.longest),
          'readingStreak.lastLoginDate': today
        };
      }
    }

    if (Object.keys(updates).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true }
      );

      res.json({ 
        message: 'Streak updated',
        readingStreak: updatedUser.readingStreak 
      });
    } else {
      res.json({ 
        message: 'Streak already updated today',
        readingStreak: user.readingStreak 
      });
    }
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to update streak' } 
    });
  }
});

// Calculate and update average rating
router.post('/rating/calculate', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ratedBooks = user.readBooks.filter(book => book.rating && book.rating > 0);
    
    let avgRating = 0;
    if (ratedBooks.length > 0) {
      const totalRating = ratedBooks.reduce((sum, book) => sum + book.rating, 0);
      avgRating = (totalRating / ratedBooks.length).toFixed(1);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avgRating: parseFloat(avgRating) } },
      { new: true }
    );

    res.json({ 
      message: 'Average rating calculated',
      avgRating: updatedUser.avgRating 
    });
  } catch (error) {
    console.error('Calculate rating error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to calculate rating' } 
    });
  }
});

module.exports = router;
