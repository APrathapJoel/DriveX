# DriveX - Premium Vehicle Rental Platform

DriveX is a modern, full-stack vehicle rental and booking management platform built with TypeScript, Vite frontend, and Express backend with Firebase/Firestore.

---

## 🚗 Features

- **Fleet Discovery & Booking**: Browse premium cars, filter by category and pricing, and book seamlessly.
- **Identity & License Verification**: Document upload and verification workflows.
- **Payment & Pricing Calculation**: Dynamic pricing calculations with multi-day rental logic.
- **Reviews & Ratings**: Customer feedback and ratings on rental experiences.
- **Admin Dashboard**: Manage vehicle inventory, rental bookings, approvals, and user accounts.
- **Notifications**: In-app notifications for booking updates and status changes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vite + TypeScript
- **Styling**: Modern Vanilla CSS with responsive design system and glassmorphism
- **Routing**: Client-side hash/history router
- **State & Auth**: Client-side auth integration with session management

### Backend
- **Runtime**: Node.js & Express
- **Database**: Firebase Admin SDK (Cloud Firestore) / Local Fallback Store
- **Security & Middleware**: JWT authentication, Multer for file uploads, centralized error handling

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
Install dependencies for both frontend and backend from the root directory:
```bash
npm run install:all
```

Or manually:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory based on `backend/.env.example`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
# Firebase Admin Configuration (if using Firestore)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### 4. Running the Development Servers

Run frontend and backend in separate terminals:
```bash
# Frontend (runs on http://localhost:5173)
npm run dev:frontend

# Backend (runs on http://localhost:5000)
npm run dev:backend
```

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Firebase configuration
│   │   ├── controllers/     # API request handlers
│   │   ├── middleware/      # Auth, upload, and error middleware
│   │   ├── models/          # Firestore data models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic & notifications
│   │   └── utils/           # Helper utilities
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── assets/          # Images and SVGs
│   │   ├── pages/           # Application views (Home, Vehicles, Admin, Dashboard, etc.)
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth helper
│   │   ├── router.ts        # SPA routing logic
│   │   └── style.css        # Core styles
│   └── package.json
└── package.json
```

---

## 📜 License
ISC License
