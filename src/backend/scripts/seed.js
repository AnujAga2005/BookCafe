const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');
const Club = require('../models/Club');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Club.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        email: 'alice@example.com',
        password: 'password123',
        username: 'alice_reads',
        displayName: 'Alice Johnson',
        bio: 'Avid reader of fantasy and sci-fi novels. Always looking for the next great adventure!',
        favoriteGenres: ['Fantasy', 'Sci-Fi', 'Adventure'],
        readingGoal: 24,
        booksRead: 18,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
      },
      {
        email: 'bob@example.com',
        password: 'password123',
        username: 'bob_bookworm',
        displayName: 'Bob Williams',
        bio: 'Mystery and thriller enthusiast. Love a good plot twist!',
        favoriteGenres: ['Mystery', 'Thriller', 'Crime'],
        readingGoal: 12,
        booksRead: 8,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
      },
      {
        email: 'carol@example.com',
        password: 'password123',
        username: 'carol_pages',
        displayName: 'Carol Davis',
        bio: 'Romance reader and coffee addict ☕📚',
        favoriteGenres: ['Romance', 'Contemporary', 'Drama'],
        readingGoal: 36,
        booksRead: 42,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
      }
    ]);

    console.log('Created sample users');

    // Set up following relationships
    users[0].following = [users[1]._id, users[2]._id];
    users[0].followers = [users[1]._id];
    users[1].following = [users[0]._id];
    users[1].followers = [users[0]._id, users[2]._id];
    users[2].following = [users[1]._id];
    users[2].followers = [users[0]._id];

    await Promise.all(users.map(user => user.save()));
    console.log('Set up user relationships');

    // Create sample clubs
    const clubs = await Club.create([
      {
        name: 'Fantasy Fanatics',
        description: 'A club for lovers of epic fantasy, magical worlds, and heroic quests.',
        category: 'fantasy',
        creator: users[0]._id,
        moderators: [users[0]._id],
        members: [
          { userId: users[0]._id },
          { userId: users[1]._id },
          { userId: users[2]._id }
        ],
        schedule: 'monthly',
        currentBook: {
          bookId: 'fantasy-1',
          title: 'The Name of the Wind',
          author: 'Patrick Rothfuss',
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
        },
        coverImage: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?w=800',
        tags: ['epic fantasy', 'magic', 'adventure']
      },
      {
        name: 'Mystery Book Club',
        description: 'Solving mysteries one book at a time!',
        category: 'mystery',
        creator: users[1]._id,
        moderators: [users[1]._id],
        members: [
          { userId: users[1]._id },
          { userId: users[2]._id }
        ],
        schedule: 'bi-weekly',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
        tags: ['mystery', 'thriller', 'detective']
      }
    ]);

    console.log('Created sample clubs');

    // Add clubs to users
    users[0].clubs = [clubs[0]._id];
    users[1].clubs = [clubs[0]._id, clubs[1]._id];
    users[2].clubs = [clubs[0]._id, clubs[1]._id];
    await Promise.all(users.map(user => user.save()));

    // Create sample posts
    await Post.create([
      {
        author: users[0]._id,
        content: 'Just finished "The Name of the Wind" and I\'m absolutely blown away! The prose is beautiful and the magic system is fascinating. Highly recommend!',
        type: 'review',
        book: {
          bookId: 'fantasy-1',
          title: 'The Name of the Wind',
          author: 'Patrick Rothfuss',
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
        },
        rating: 5,
        likes: [users[1]._id, users[2]._id],
        comments: [
          {
            author: users[1]._id,
            content: 'One of my all-time favorites! Have you read the sequel?',
            createdAt: new Date()
          }
        ]
      },
      {
        author: users[1]._id,
        content: 'Starting a new thriller tonight - "Gone Girl". Heard amazing things about it!',
        type: 'update',
        book: {
          bookId: 'thriller-1',
          title: 'Gone Girl',
          author: 'Gillian Flynn',
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
        },
        likes: [users[0]._id],
        tags: ['thriller', 'mystery']
      },
      {
        author: users[2]._id,
        content: 'Looking for cozy romance recommendations! What are your favorites?',
        type: 'discussion',
        likes: [users[0]._id, users[1]._id],
        comments: [
          {
            author: users[0]._id,
            content: 'Try "Beach Read" by Emily Henry!',
            createdAt: new Date()
          }
        ],
        tags: ['romance', 'recommendations']
      }
    ]);

    console.log('Created sample posts');
    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample users:');
    console.log('- alice@example.com / password123');
    console.log('- bob@example.com / password123');
    console.log('- carol@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
