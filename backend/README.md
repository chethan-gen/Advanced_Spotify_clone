# Spotify Clone Backend

## Production Deployment Guide

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or MongoDB instance
- Cloudinary account for file uploads
- Clerk account for authentication

### Environment Variables
Copy `.env.example` to `.env.production` and configure:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

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

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Installation & Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **For development:**
   ```bash
   npm run dev
   ```

### Health Check
- Endpoint: `GET /health`
- Returns server status and environment info

### API Endpoints
- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/admin` - Admin operations
- `/api/songs` - Song management
- `/api/albums` - Album management
- `/api/stats` - Statistics

### Features
- ✅ Environment-aware CORS configuration
- ✅ File upload handling with Cloudinary
- ✅ Real-time chat with Socket.io
- ✅ Clerk authentication integration
- ✅ MongoDB database integration
- ✅ Automatic temp file cleanup
- ✅ Error handling and logging
- ✅ Graceful shutdown handling
- ✅ Health check endpoint

### Security
- CORS configured for production
- Environment-based error messages
- Admin role protection
- Authentication middleware
