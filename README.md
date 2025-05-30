# LMS Learning Platform

A full-featured Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication and authorization
- Course creation and management
- Video lectures with Cloudinary integration
- Payment processing with Stripe
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Stripe account (for payment processing)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/lms-learning-platform.git
cd lms-learning-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit the `.env` file and add your credentials:
- MongoDB connection string
- Cloudinary API keys
- Stripe API keys
- JWT secret key

```bash
# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit the `.env` file and add your credentials:
- API base URL
- Stripe public key

```bash
# Start the frontend development server
npm run dev
```

## Environment Variables

### Backend (.env)

```
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Server Configuration
PORT=8080
SECRET_KEY=your_secret_key_here
NODE_ENV=development

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cloudinary Configuration
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Frontend (.env)

```
# API Base URL - Set to your backend URL
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Deployment

### Backend

1. Set up a MongoDB Atlas cluster
2. Deploy to a hosting service like Heroku, Render, or Railway
3. Set the environment variables in your hosting dashboard

### Frontend

1. Build the frontend: `npm run build`
2. Deploy to a static hosting service like Netlify, Vercel, or GitHub Pages
3. Set the environment variables in your hosting dashboard

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
#   N e w _ L M S _ p r o j e c t _ c a n  
 