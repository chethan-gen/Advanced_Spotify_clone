# 🎵 Advanced Spotify Clone

A modern, full-featured music streaming application built with React, TypeScript, Node.js, and MongoDB. This project replicates core Spotify functionality with additional features like real-time chat, admin dashboard, and seamless music playback.


## ✨ Features

### 🎶 Music Streaming
- **High-quality audio playback** with full player controls
- **Queue management** with next/previous track functionality
- **Featured, trending, and personalized** music sections
- **Album and song browsing** with detailed views
- **Real-time activity tracking** showing what users are listening to

### 👥 Social Features
- **Real-time chat system** with Socket.io integration
- **Online user presence** indicators
- **Activity sharing** - see what friends are listening to
- **User authentication** via Clerk with OAuth support

### 🛠️ Admin Dashboard
- **Complete music library management**
- **Upload songs and albums** with Cloudinary integration
- **Real-time statistics** dashboard
- **Content moderation** and deletion capabilities
- **Admin role-based access control**

### 🎨 Modern UI/UX
- **Responsive design** optimized for all devices
- **Dark theme** with Spotify-inspired aesthetics
- **Smooth animations** and transitions
- **Resizable panels** for customizable layout
- **Toast notifications** for user feedback

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling with shadcn/ui components
- **Zustand** for state management
- **React Router** for navigation
- **Socket.io Client** for real-time features
- **Axios** for API communication

### Backend (Node.js + Express)
- **Express.js** server with ES6 modules
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **Clerk** for authentication and user management
- **Cloudinary** for file storage and media management
- **Express File Upload** for handling media uploads
- **Node Cron** for automated cleanup tasks

## 📁 Project Structure

```
Advanced_Spotify_clone/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state management
│   │   ├── types/          # TypeScript type definitions
│   │   ├── lib/            # Utility functions
│   │   ├── layout/         # Layout components
│   │   └── providers/      # Context providers
│   ├── public/             # Static assets
│   └── dist/               # Built frontend files
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controller/     # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── lib/            # Utility functions
│   │   └── seeds/          # Database seeders
│   └── tmp/                # Temporary file storage
└── package.json            # Root package configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** Atlas account or local MongoDB instance
- **Cloudinary** account for file uploads
- **Clerk** account for authentication

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Backend `.env`
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Admin Configuration
ADMIN_EMAIL=your-admin-email@example.com

# Cloudinary Configuration
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

#### Frontend `.env`
```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/chethan-gen/Advanced_Spotify_clone.git
cd Advanced_Spotify_clone
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Start development servers**

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

4. **Build for production**
```bash
# Build entire project (from root directory)
npm run build

# Start production server
npm start
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/callback` - Handle authentication callback

### Songs
- `GET /api/songs/featured` - Get featured songs
- `GET /api/songs/made-for-you` - Get personalized recommendations
- `GET /api/songs/trending` - Get trending songs
- `GET /api/songs` - Get all songs (Admin only)

### Albums
- `GET /api/albums` - Get all albums
- `GET /api/albums/:albumId` - Get specific album

### Admin
- `GET /api/admin/check` - Check admin status
- `POST /api/admin/songs` - Create new song
- `DELETE /api/admin/songs/:id` - Delete song
- `POST /api/admin/albums` - Create new album
- `DELETE /api/admin/albums/:id` - Delete album

### Users & Chat
- `GET /api/users` - Get all users
- `GET /api/users/messages/:userId` - Get chat messages
- Real-time messaging via Socket.io

### Statistics
- `GET /api/stats` - Get platform statistics

## 🎯 Key Technologies

### Frontend Stack
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time communication

### Backend Stack
- **Express.js** - Fast, minimalist web framework
- **MongoDB & Mongoose** - NoSQL database with ODM
- **Socket.io** - Real-time bidirectional communication
- **Clerk** - Complete authentication solution
- **Cloudinary** - Cloud-based media management
- **Node Cron** - Task scheduling

## 🔐 Security Features

- **JWT-based authentication** via Clerk
- **Role-based access control** for admin features
- **CORS configuration** for secure cross-origin requests
- **File upload validation** and size limits
- **Environment-based error handling**
- **Secure API endpoints** with middleware protection

## 🎨 UI Components

Built with modern, accessible components:
- **Responsive layout** with resizable panels
- **Audio player** with full playback controls
- **Real-time chat interface**
- **Admin dashboard** with data visualization
- **Modal dialogs** for forms and confirmations
- **Loading states** and skeleton screens
- **Toast notifications** for user feedback

## 📱 Responsive Design

- **Mobile-first approach** with breakpoint optimization
- **Adaptive layouts** for different screen sizes
- **Touch-friendly controls** for mobile devices
- **Progressive enhancement** for better performance

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- Configure production environment variables
- Set up MongoDB Atlas for database
- Configure Cloudinary for media storage
- Set up Clerk for authentication
- Deploy to your preferred hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify** for design inspiration
- **Clerk** for authentication services
- **Cloudinary** for media management
- **MongoDB** for database services
- **Vercel** for hosting solutions

---

**Built with ❤️ by [Chethan](https://github.com/chethan-gen)**
