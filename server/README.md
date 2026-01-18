# MongoDB Atlas Backend Server

This is the Node.js/Express backend server for the Product Management application, using MongoDB Atlas as the database.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account with a cluster set up

## Setup

1. **Create a MongoDB Atlas Cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user with read/write access
   - Whitelist your IP address (or use 0.0.0.0/0 for development)
   - Get your connection string

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-key-change-in-production
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the Server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new user account |
| POST | `/api/auth/signin` | Sign in with email/password |
| POST | `/api/auth/send-otp` | Send OTP to email (demo mode) |
| POST | `/api/auth/verify-otp` | Verify OTP and get access token |

### Products (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products for authenticated user |
| GET | `/api/products/:id` | Get single product by ID |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### File Upload (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload-image` | Upload product image |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## Database Collections

The server automatically creates the following collections:

- `users` - User accounts
- `products` - Product listings
- `otps` - OTP verification codes (temporary)
- `kv_store` - Key-value store (for compatibility)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── products.js      # Product CRUD
│   │   └── upload.js        # File uploads
│   ├── services/
│   │   └── kvStore.js       # KV store service
│   └── index.js             # Main server entry
├── uploads/                  # Uploaded files
├── .env.example
├── package.json
└── README.md
```

## Deployment

For production deployment:

1. Set proper environment variables
2. Use a proper JWT secret (long, random string)
3. Consider using cloud storage (AWS S3, Cloudinary) for images
4. Set up proper CORS origins
5. Enable HTTPS
