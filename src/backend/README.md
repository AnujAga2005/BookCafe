# Book Lovers Platform - Backend

This is the backend API for the Book Lovers social media platform built with Node.js, Express, MongoDB, and Passport.js.

## Features

- **Authentication & Authorization**
  - Email/Password authentication
  - Google OAuth 2.0 integration
  - Session-based authentication with express-session
  - Passport.js for authentication strategies

- **User Management**
  - User profiles with reading stats
  - Follow/unfollow functionality
  - Reading lists (currently reading, read, want to read)
  - Reading progress tracking
  - Badges and achievements

- **Social Features**
  - Create posts (reviews, updates, recommendations)
  - Like and comment on posts
  - Personalized feed from followed users
  - Explore page for discovering content

- **Book Clubs**
  - Create and manage book clubs
  - Join/leave clubs
  - Club discussions and current book tracking
  - Moderator roles

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
  - passport-local - Local strategy
  - passport-google-oauth20 - Google OAuth strategy
- **express-session** - Session management
- **connect-mongo** - MongoDB session store
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials (optional, for Google login)

### Installation

1. Clone the repository and navigate to the backend folder

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/booklovers
SESSION_SECRET=your-super-secret-session-key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

5. Start MongoDB (if running locally)

6. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Seeding the Database

To populate the database with sample data:

```bash
npm run seed
```

This will create sample users, posts, and clubs for testing.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/status` - Check authentication status

### Users

- `GET /api/users/:username` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:userId/follow` - Follow user
- `POST /api/users/:userId/unfollow` - Unfollow user
- `POST /api/users/reading/current` - Add to currently reading
- `PUT /api/users/reading/current/:bookId` - Update reading progress
- `POST /api/users/reading/finished` - Mark book as read
- `POST /api/users/reading/wishlist` - Add to wishlist

### Posts

- `GET /api/posts/feed` - Get personalized feed
- `GET /api/posts/explore` - Get all posts
- `GET /api/posts/user/:username` - Get user's posts
- `POST /api/posts` - Create post
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/unlike` - Unlike post
- `POST /api/posts/:postId/comment` - Add comment
- `DELETE /api/posts/:postId` - Delete post

### Clubs

- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:clubId` - Get club details
- `POST /api/clubs` - Create club
- `POST /api/clubs/:clubId/join` - Join club
- `POST /api/clubs/:clubId/leave` - Leave club
- `PUT /api/clubs/:clubId` - Update club
- `DELETE /api/clubs/:clubId` - Delete club

### Books

- `GET /api/books/search` - Search books
- `GET /api/books/:bookId` - Get book details
- `GET /api/books/trending` - Get trending books

## Project Structure

```
backend/
├── config/
│   └── passport.js          # Passport configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Post.js              # Post model
│   └── Club.js              # Club model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User routes
│   ├── post.js              # Post routes
│   ├── club.js              # Club routes
│   └── book.js              # Book routes
├── scripts/
│   └── seed.js              # Database seeding script
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
└── server.js               # Main server file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No* |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No* |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | No* |

*Required only if using Google OAuth

## Deployment

See the `/tut.txt` file in the project root for detailed deployment instructions including:
- MongoDB Atlas setup
- Google OAuth configuration
- Deploying to Railway/Render
- Environment configuration for production

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- CORS protection
- HTTP-only cookies
- Secure cookies in production
- Input validation
- MongoDB injection protection via Mongoose

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restarts on file changes.

### Testing API Endpoints

You can test the API using:
- Postman
- Insomnia
- curl
- Your frontend application

Example using curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser","displayName":"Test User"}'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
