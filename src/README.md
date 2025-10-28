# 📚 BookCafe - A Community-Driven Social Platform for Book Lovers

<div align="center">

![BookCafe](https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=200&fit=crop)

**A warm, cozy, and community-driven social media platform for book enthusiasts**

[Features](#features) • [Demo](#demo) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Deployment](#deployment) • [API Documentation](#api-documentation)

</div>

---

## 🚨 Getting "Route Not Found" or "Failed to Fetch" Errors?

### → **[READ_FIRST.md](./README_FIRST.md)** ← START HERE!

**Quick Links:**
- **[START_HERE.md](./START_HERE.md)** - Step-by-step backend setup (5 min)
- **[ROUTE_NOT_FOUND_FIX.md](./ROUTE_NOT_FOUND_FIX.md)** - Complete diagnostic guide
- **[QUICK_FIX.md](./QUICK_FIX.md)** - Quick reference
- **[SETUP_TROUBLESHOOTING.md](./SETUP_TROUBLESHOOTING.md)** - Comprehensive help
- **[STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md)** - Step-by-step verification

---

## 🌟 Features

### 📖 Reading Management
- **Track Your Reading**: Maintain lists of currently reading, read, and want-to-read books
- **Reading Progress**: Track your progress through current books
- **Reading Goals**: Set and achieve annual reading goals
- **Reading Analytics**: Visualize your reading habits with beautiful charts and statistics
- **Reading Streaks**: Build and maintain reading streaks with gamification

### 👥 Social Features
- **Feed**: Personalized feed from users you follow
- **Posts**: Share reviews, updates, recommendations, and discussions
- **Interactions**: Like and comment on posts
- **Follow System**: Follow other readers and build your reading community
- **User Profiles**: Customizable profiles with reading stats and shelves

### 📚 Book Clubs
- **Create Clubs**: Start book clubs based on genres or interests
- **Join Clubs**: Discover and join existing clubs
- **Club Discussions**: Engage in book discussions with club members
- **Reading Schedules**: Weekly, bi-weekly, or monthly reading schedules
- **Current Book**: Track what the club is currently reading together

### 🏆 Gamification
- **Badges & Achievements**: Earn badges for reading milestones
- **Reading Challenges**: Complete reading challenges
- **Leaderboards**: See top readers in the community

### 🎨 Design & UX
- **Warm Aesthetic**: Cozy, bookish design with earthy tones
- **Dark/Light Mode**: Beautiful themes for any reading environment
  - Light: Warm beige, cream, soft green, coffee brown
  - Dark: Deep brown/charcoal with neon amber, emerald, violet accents
- **Smooth Animations**: Delightful micro-interactions powered by Motion (Framer Motion)
- **Responsive Design**: Seamless experience on desktop and mobile
- **Playful Illustrations**: Books, coffee cups, lamps, and other cozy elements

### 🔐 Authentication
- **Email/Password**: Traditional authentication
- **Google OAuth**: Quick sign-in with Google
- **Session Management**: Secure, persistent sessions
- **Protected Routes**: Secure access to authenticated features

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling with custom design tokens
- **shadcn/ui** - High-quality UI components
- **Motion (Framer Motion)** - Smooth animations
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication
  - Local Strategy (Email/Password)
  - Google OAuth 2.0
- **express-session** - Session management
- **connect-mongo** - MongoDB session store
- **bcryptjs** - Password hashing

---

## 🚀 Getting Started

### ⚠️ Having Issues? Check the [Setup & Troubleshooting Guide](./SETUP_TROUBLESHOOTING.md)

### Prerequisites
- Node.js v18 or higher
- MongoDB (local installation or MongoDB Atlas account)
- Google OAuth credentials (optional, for Google login)
- npm or yarn package manager

### Quick Start

1. **Clone and navigate to the project**
```bash
cd your-project-folder
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your MongoDB URI and other settings
npm run dev
```

3. **Setup Frontend** (in a new terminal)
```bash
npm install
npm run dev
```

4. **Access the app**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- Backend Health Check: http://localhost:5001/api/health

### Detailed Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/booklovers
SESSION_SECRET=your-super-secret-session-key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

4. **Start MongoDB**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Seed database (optional)**
```bash
npm run seed
```

This creates sample users:
- alice@example.com / password123
- bob@example.com / password123
- carol@example.com / password123

6. **Start backend server**
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root**
```bash
cd ..  # If you're in backend folder
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

5. **Open in browser**
```
http://localhost:5173
```

---

## 📁 Project Structure

```
booklovers-platform/
├── backend/                    # Backend API
│   ├── config/
│   │   └── passport.js        # Passport authentication config
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Post.js            # Post model
│   │   └── Club.js            # Book club model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── user.js            # User routes
│   │   ├── post.js            # Post routes
│   │   ├── club.js            # Club routes
│   │   └── book.js            # Book routes
│   ├── scripts/
│   │   └── seed.js            # Database seeding
│   ├── .env.example           # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js              # Main server file
│
├── src/                       # Frontend source
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── AnalyticsPage.tsx
│   │   ├── BookClubsPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── FeedPage.tsx
│   │   ├── Footer.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx      # Authentication UI
│   │   ├── Navigation.tsx
│   │   ├── PostCard.tsx
│   │   ├── ProfilePage.tsx
│   │   └── Sidebar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── services/
│   │   └── api.ts             # API service layer
│   └── styles/
│       └── globals.css        # Global styles & tokens
│
├── .env.example               # Frontend env template
├── App.tsx                    # Main app component
├── INTEGRATION_GUIDE.md       # Integration guide
├── package.json
├── README.md                  # This file
├── tut.txt                    # Deployment tutorial
└── tsconfig.json
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login with email/password | No |
| GET | `/api/auth/google` | Initiate Google OAuth | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/status` | Check auth status | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/:username` | Get user profile | No |
| PUT | `/api/users/profile` | Update profile | Yes |
| POST | `/api/users/:userId/follow` | Follow user | Yes |
| POST | `/api/users/:userId/unfollow` | Unfollow user | Yes |
| POST | `/api/users/reading/current` | Add to currently reading | Yes |
| PUT | `/api/users/reading/current/:bookId` | Update progress | Yes |
| POST | `/api/users/reading/finished` | Mark book as read | Yes |
| POST | `/api/users/reading/wishlist` | Add to wishlist | Yes |

### Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts/feed` | Get personalized feed | Yes |
| GET | `/api/posts/explore` | Get all posts | No |
| GET | `/api/posts/user/:username` | Get user's posts | No |
| POST | `/api/posts` | Create post | Yes |
| POST | `/api/posts/:postId/like` | Like post | Yes |
| POST | `/api/posts/:postId/unlike` | Unlike post | Yes |
| POST | `/api/posts/:postId/comment` | Add comment | Yes |
| DELETE | `/api/posts/:postId` | Delete post | Yes |

### Club Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/clubs` | Get all clubs | No |
| GET | `/api/clubs/:clubId` | Get club details | No |
| POST | `/api/clubs` | Create club | Yes |
| POST | `/api/clubs/:clubId/join` | Join club | Yes |
| POST | `/api/clubs/:clubId/leave` | Leave club | Yes |
| PUT | `/api/clubs/:clubId` | Update club | Yes |
| DELETE | `/api/clubs/:clubId` | Delete club | Yes |

For detailed API documentation and request/response examples, see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md).

---

## 🚢 Deployment

### Quick Deployment Guide

1. **Set up MongoDB Atlas** (Free tier available)
2. **Configure Google OAuth** (For Google login)
3. **Deploy Backend** to Railway or Render
4. **Deploy Frontend** to Vercel or Netlify
5. **Update Environment Variables** for production

### Detailed Instructions

See [tut.txt](tut.txt) for comprehensive deployment guide including:
- MongoDB Atlas setup
- Google OAuth configuration
- Backend deployment (Railway/Render)
- Frontend deployment (Vercel/Netlify)
- Environment configuration
- Domain setup
- Troubleshooting

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
SESSION_SECRET=your-random-secret
FRONTEND_URL=https://your-frontend.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app
```

---

## 🔧 Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
npm test
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

### Building for Production
```bash
# Frontend
npm run build

# Backend (no build step needed, runs directly)
cd backend
npm start
```

---

## 📖 Usage Guide

### For Users

1. **Sign Up**: Create an account or sign in with Google
2. **Set Up Profile**: Add your favorite genres and reading goal
3. **Discover Books**: Explore the book catalog
4. **Track Reading**: Add books to your shelves and track progress
5. **Connect**: Follow other readers and engage with their posts
6. **Join Clubs**: Find and join book clubs
7. **Share**: Post reviews, updates, and recommendations
8. **Achieve**: Earn badges and build reading streaks

### For Developers

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for:
- Frontend-Backend integration
- API usage examples
- Authentication flow
- Component patterns
- Error handling
- Best practices

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure `FRONTEND_URL` in backend .env matches your frontend URL
- Check that credentials: 'include' is set in API calls

**Authentication Not Working**
- Verify MongoDB is running
- Check session secret is set
- Clear browser cookies and try again

**Google OAuth Fails**
- Verify Google OAuth credentials
- Check authorized redirect URIs match exactly
- Ensure callback URL is correct

**Database Connection Error**
- Check MongoDB URI format
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

For more troubleshooting, see [tut.txt](tut.txt).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful, accessible UI components
- **Unsplash** - High-quality book images
- **Motion (Framer Motion)** - Smooth animations
- **Recharts** - Data visualization
- **MongoDB** - Database
- **Express.js** - Web framework
- **Passport.js** - Authentication

---

## 📧 Contact & Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Start a discussion for questions
- **Email**: your-email@example.com

---

## 🗺 Roadmap

### Phase 1: MVP (Current)
- [x] User authentication
- [x] Reading lists
- [x] Social feed
- [x] Book clubs
- [x] Analytics
- [x] Dark/Light mode

### Phase 2: Enhanced Features
- [ ] Real-time chat
- [ ] Book API integration (Google Books)
- [ ] Advanced search and filters
- [ ] Reading challenges
- [ ] Book recommendations AI
- [ ] Mobile app (React Native)

### Phase 3: Community Growth
- [ ] Verified readers badge
- [ ] Author accounts
- [ ] Virtual book events
- [ ] Reading groups video calls
- [ ] Book swap marketplace
- [ ] Newsletter integration

---

<div align="center">

**Made with ❤️ for book lovers everywhere**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/booklovers/issues) • [Request Feature](https://github.com/yourusername/booklovers/issues) • [Documentation](INTEGRATION_GUIDE.md)

</div>
