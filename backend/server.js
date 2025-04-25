import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './server/database/db.js';
import userRoute from "./routes/userRoutes.js"
import cookieParser from 'cookie-parser';
import cors from 'cors'
import courseRoute from './routes/courseRoute.js'
import mediaRoute from './routes/mediaRoute.js'
import purchaseRoute from './routes/purchaseCourseRoutes.js'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express();

// Start the server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('🚀 Initializing server...');

    // Attempt to connect to the database
    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.warn('⚠️ Starting server with limited functionality due to database connection issues');
    } else {
      console.log('✅ Database connection established');
    }

    // Configure CORS with allowed origins from environment variable or defaults
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'];

    console.log('🔒 CORS configured with allowed origins:', allowedOrigins);

    // Set up CORS middleware
    app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
    }));

    // Handle Stripe webhook route BEFORE body parsers
    // This is important because Stripe needs the raw body for signature verification
    app.post('/api/v1/purchase/webhook',
      express.raw({ type: 'application/json' }),
      async (req, res) => {
        try {
          const { stripeWebhook } = await import('./server/controllers/coursePurchase.js');
          return stripeWebhook(req, res);
        } catch (error) {
          console.error('Webhook error:', error);
          return res.status(500).json({ error: 'Webhook processing failed' });
        }
      }
    );

    // Configure middleware for all other routes
    app.use(express.json());
    app.use(cookieParser());

    // Set up API routes
    app.use("/api/v1/user", userRoute);
    app.use('/api/v1/course', courseRoute);
    app.use('/api/v1/media', mediaRoute);
    app.use('/api/v1/purchase', purchaseRoute);

    // Add a health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        dbConnected: mongoose.connection.readyState === 1,
        timestamp: new Date().toISOString()
      });
    });

    // Handle 404 errors
    app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
      });
    });

    // Start the server
    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 API available at http://localhost:${PORT}/api/v1`);
      console.log(`💻 Health check at http://localhost:${PORT}/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('💤 Server closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();