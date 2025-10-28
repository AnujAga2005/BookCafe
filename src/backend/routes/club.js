const express = require('express');
const Club = require('../models/Club');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const clubs = await Club.find(filter)
      .populate('creator', 'username displayName avatar')
      .sort({ createdAt: -1 });

    res.json({ clubs });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch clubs' } 
    });
  }
});

// Get club by ID
router.get('/:clubId', async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId)
      .populate('creator', 'username displayName avatar')
      .populate('moderators', 'username displayName avatar')
      .populate('members.userId', 'username displayName avatar');

    if (!club) {
      return res.status(404).json({ 
        error: { message: 'Club not found' } 
      });
    }

    res.json({ club });
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch club' } 
    });
  }
});

// Create a new club
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, description, coverImage, category, schedule, isPrivate, rules, tags } = req.body;

    console.log('Creating club with data:', { name, description, category });
    console.log('User ID:', req.user._id);

    if (!name || !description) {
      return res.status(400).json({ 
        error: { message: 'Name and description are required' } 
      });
    }

    const club = await Club.create({
      name,
      description,
      coverImage: coverImage || '',
      category: (category || 'general').toLowerCase(),
      creator: req.user._id,
      moderators: [req.user._id],
      members: [{
        userId: req.user._id,
        joinedAt: new Date()
      }],
      schedule: schedule || 'weekly',
      isPrivate: isPrivate || false,
      rules: rules || [],
      tags: tags || []
    });

    console.log('Club created:', club._id);

    // Add club to user's clubs
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { clubs: club._id }
    });

    console.log('Club added to user');

    const populatedClub = await Club.findById(club._id)
      .populate('creator', 'username displayName avatar');

    res.status(201).json({ 
      message: 'Club created successfully',
      club: populatedClub
    });
  } catch (error) {
    console.error('Create club error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: { message: error.message || 'Failed to create club' } 
    });
  }
});

// Join a club
router.post('/:clubId/join', isAuthenticated, async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) {
      return res.status(404).json({ 
        error: { message: 'Club not found' } 
      });
    }

    // Check if already a member
    const isMember = club.members.some(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ 
        error: { message: 'Already a member of this club' } 
      });
    }

    // Add member to club
    await Club.findByIdAndUpdate(req.params.clubId, {
      $push: {
        members: {
          userId: req.user._id,
          joinedAt: new Date()
        }
      }
    });

    // Add club to user's clubs
    await User.findByIdAndUpdate(req.user._id, {
      $push: { clubs: req.params.clubId }
    });

    res.json({ message: 'Successfully joined club' });
  } catch (error) {
    console.error('Join club error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to join club' } 
    });
  }
});

// Leave a club
router.post('/:clubId/leave', isAuthenticated, async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) {
      return res.status(404).json({ 
        error: { message: 'Club not found' } 
      });
    }

    // Don't allow creator to leave
    if (club.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        error: { message: 'Club creator cannot leave. Transfer ownership or delete the club.' } 
      });
    }

    // Remove member from club
    await Club.findByIdAndUpdate(req.params.clubId, {
      $pull: {
        members: { userId: req.user._id },
        moderators: req.user._id
      }
    });

    // Remove club from user's clubs
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { clubs: req.params.clubId }
    });

    res.json({ message: 'Successfully left club' });
  } catch (error) {
    console.error('Leave club error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to leave club' } 
    });
  }
});

// Update club
router.put('/:clubId', isAuthenticated, async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) {
      return res.status(404).json({ 
        error: { message: 'Club not found' } 
      });
    }

    // Check if user is creator or moderator
    const isAuthorized = 
      club.creator.toString() === req.user._id.toString() ||
      club.moderators.some(mod => mod.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ 
        error: { message: 'Not authorized to update this club' } 
      });
    }

    const { name, description, coverImage, category, schedule, currentBook, rules, tags } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (category) updates.category = category;
    if (schedule) updates.schedule = schedule;
    if (currentBook) updates.currentBook = currentBook;
    if (rules) updates.rules = rules;
    if (tags) updates.tags = tags;

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.clubId,
      { $set: updates },
      { new: true }
    );

    res.json({ 
      message: 'Club updated successfully',
      club: updatedClub 
    });
  } catch (error) {
    console.error('Update club error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to update club' } 
    });
  }
});

// Delete club
router.delete('/:clubId', isAuthenticated, async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) {
      return res.status(404).json({ 
        error: { message: 'Club not found' } 
      });
    }

    // Only creator can delete
    if (club.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: { message: 'Only the creator can delete this club' } 
      });
    }

    // Remove club from all members' clubs array
    await User.updateMany(
      { clubs: req.params.clubId },
      { $pull: { clubs: req.params.clubId } }
    );

    await Club.findByIdAndDelete(req.params.clubId);

    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Delete club error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to delete club' } 
    });
  }
});

module.exports = router;
