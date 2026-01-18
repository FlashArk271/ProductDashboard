# Seller Admin Product Management

A modern product management dashboard for sellers to manage their inventory, with OTP-based authentication and a clean, intuitive interface.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)

## Live Demo

- **Frontend**: [https://product-dashboard-sigma-drab.vercel.app](https://product-dashboard-sigma-drab.vercel.app)
- **Backend API**: [https://productdashboard-oc2r.onrender.com](https://productdashboard-oc2r.onrender.com)

## Features

- **OTP-based Authentication** - Secure login with email OTP verification
- **Product Management** - Add, edit, delete, and publish products
- **Image Upload** - Multiple product images with preview
- **Dashboard** - View published and unpublished products
- **Product Categories** - Foods, Electronics, Clothes, Beauty Products, Others
- **Exchange Eligibility** - Mark products as eligible for exchange/return
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **MongoDB Atlas** for database
- **JWT** for authentication
- **Multer** for file uploads

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git

### Clone the Repository

```bash
git clone https://github.com/FlashArk271/ProductDashboard.git
cd ProductDashboard
```

---

## 🖥️ How to Run the Frontend

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Optional for local development)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

> **Note**: For local development, the app automatically uses `localhost:3001`. The environment variable is optional.

### 3. Run Frontend

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### 4. Build for Production

```bash
npm run build
```

---

## ⚙️ How to Run the Backend

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables (Required)

Create a `.env` file in the `server` directory:

```env
# MongoDB Atlas Configuration (REQUIRED)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Configuration (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001

# Frontend URL for CORS (for production)
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 4. Run Backend

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend will be available at: **http://localhost:3001**

### 5. Verify Backend is Running

Open in browser: http://localhost:3001/api/health

Should return:
```json
{"status":"ok"}
```

---

## 📁 Required Environment Variables

### Frontend (`.env` in root directory)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | `http://localhost:3001/api` |

### Backend (`server/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | **Yes** | - |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | **Yes** | - |
| `JWT_EXPIRES_IN` | JWT token expiration | No | `7d` |
| `PORT` | Server port | No | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `*` |

---

## 🔧 MongoDB Atlas Setup

### Getting MongoDB URI:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free account
2. Create a new cluster (free tier M0 is sufficient)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add your database name (e.g., `product_management`) before the `?`

**Example:**
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/product_management?retryWrites=true&w=majority
```

### Important MongoDB Atlas Settings:

1. **Network Access**: 
   - Go to **Network Access** → **Add IP Address** 
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   
2. **Database Access**: 
   - Go to **Database Access** → **Add New Database User**
   - Create a user with **Read and Write** permissions

---

## 🌐 Deployment

### Frontend (Vercel - Free)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com) → Import project
3. Framework: **Vite**
4. Deploy!

### Backend (Render - Free)

1. Go to [Render](https://render.com) → New Web Service
2. Connect GitHub repository
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables (`MONGODB_URI`, `JWT_SECRET`)
5. Deploy!

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API info | No |
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/send-otp` | Send OTP to email | No |
| POST | `/api/auth/verify-otp` | Verify OTP & login | No |
| POST | `/api/auth/signup` | Create account | No |
| POST | `/api/auth/signin` | Login with password | No |
| GET | `/api/products` | Get all products | Yes |
| POST | `/api/products` | Create product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |
| POST | `/api/upload-image` | Upload image | Yes |

---

## 📂 Project Structure

```
ProductDashboard/
├── src/                      # Frontend source
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── AuthPage.tsx      # OTP login page
│   │   │   ├── Dashboard.tsx     # Main dashboard
│   │   │   └── ProductModal.tsx  # Add/Edit product modal
│   │   └── App.tsx
│   ├── utils/
│   │   └── api.ts            # API client
│   └── styles/               # CSS files
│
├── server/                   # Backend source
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js   # MongoDB connection
│   │   ├── routes/
│   │   │   ├── auth.js       # Auth endpoints
│   │   │   ├── products.js   # Product CRUD
│   │   │   └── upload.js     # File upload
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   └── index.js          # Express server
│   ├── .env.example          # Example environment variables
│   └── package.json
│
├── utils/
│   └── mongodb/
│       └── config.ts         # API URL configuration
│
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
└── README.md
```

---

## 🛠️ Development

### Run Both Frontend & Backend Simultaneously

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Quick Start (Copy & Paste)

```bash
# Clone and setup
git clone https://github.com/FlashArk271/ProductDashboard.git
cd ProductDashboard

# Setup backend
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev

# In a new terminal - setup frontend
cd ProductDashboard
npm install
npm run dev
```



