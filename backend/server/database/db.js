import mongoose from 'mongoose';
import inMemoryDb from './fallback-db.js';

/**
 * Connect to MongoDB database
 * This function handles connection to either MongoDB Atlas or local MongoDB
 * If connection fails, it will use an in-memory database for development
 */
const connectDB = async () => {
  // Maximum number of connection attempts
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let connected = false;

  // Function to attempt connection with retry logic
  const attemptConnection = async () => {
    try {
      // Check if MONGO_URI is defined
      if (!process.env.MONGO_URI) {
        console.error("❌ MONGO_URI is not defined in environment variables");
        console.error("Please check your .env file and add a valid MONGO_URI");
        return false;
      }

      // Make sure the connection string has a database name
      let connectionString = process.env.MONGO_URI;
      if (connectionString.endsWith('/')) {
        connectionString += 'lms';
      } else if (!connectionString.split('/').pop() || connectionString.endsWith('?')) {
        // Handle cases where the connection string ends with a question mark
        const baseUri = connectionString.split('?')[0];
        const params = connectionString.includes('?') ? connectionString.split('?')[1] : '';

        if (baseUri.endsWith('/')) {
          connectionString = `${baseUri}lms${params ? '?' + params : ''}`;
        } else {
          connectionString = `${baseUri}/lms${params ? '?' + params : ''}`;
        }
      }

      // Mask sensitive parts of the connection string in logs
      const maskedConnectionString = connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
      console.log(`🔄 Connecting to MongoDB... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      console.log(`📡 Connection string: ${maskedConnectionString}`);

      // Set up mongoose connection options
      const options = {
        serverSelectionTimeoutMS: 15000, // Timeout after 15s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        // The following options may already be in your connection string
        // Only include them if they're not already specified
        ...(connectionString.includes('retryWrites') ? {} : { retryWrites: true }),
        ...(connectionString.includes('w=') ? {} : { w: 'majority' }),
        ...(connectionString.includes('retryReads') ? {} : { retryReads: true }),
      };

      // Connect to MongoDB
      await mongoose.connect(connectionString, options);

      // Get database name and connection details
      const dbName = mongoose.connection.name;
      const isAtlas = connectionString.includes('mongodb+srv');
      const host = mongoose.connection.host;

      console.log(`✅ MongoDB Connected Successfully!`);
      console.log(`📊 Connected to database: ${dbName}`);
      console.log(`🖥️  Host: ${isAtlas ? 'MongoDB Atlas' : host}`);

      return true;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error (Attempt ${retryCount + 1}/${MAX_RETRIES}):`);

      // Provide more helpful error messages based on the error type
      if (error.name === 'MongooseServerSelectionError') {
        console.error("🔍 Server Selection Error: Could not connect to any MongoDB servers");

        // Check if it's an authentication error
        if (error.message.includes('Authentication failed')) {
          console.error("🔐 Authentication Error: Your username or password is incorrect");
          console.error("Please check your MongoDB Atlas credentials in the .env file");
          // Authentication errors won't be fixed by retrying
          return false;
        }

        // Check if it's a network error
        if (error.message.includes('ECONNREFUSED')) {
          console.error("🌐 Connection Refused: Could not connect to the MongoDB server");
          if (process.env.MONGO_URI.includes('localhost')) {
            console.error("If you're using a local MongoDB, make sure it's running");
          } else {
            console.error("If you're using MongoDB Atlas, check your network connection and firewall settings");
          }
        }

        // Check if it's an IP whitelist error
        if (error.message.includes('IP address is not allowed')) {
          console.error("🛡️ IP Whitelist Error: Your current IP address is not allowed to access the database");
          console.error("Please add your IP address to the MongoDB Atlas whitelist");
          console.error("1. Go to MongoDB Atlas dashboard");
          console.error("2. Navigate to Network Access");
          console.error("3. Click 'Add IP Address'");
          console.error("4. Add your current IP or use '0.0.0.0/0' for development");
          // IP whitelist errors won't be fixed by retrying
          return false;
        }

        console.error("\n🔧 Possible solutions:");
        console.error("1. Check if your IP is whitelisted in MongoDB Atlas");
        console.error("2. Verify your username and password");
        console.error("3. Make sure your MongoDB Atlas cluster is running");
        console.error("4. Try using a local MongoDB instance for development");
        console.error("5. Check your network connection and firewall settings");
      } else {
        console.error(`Error: ${error.message}`);
      }

      return false;
    }
  };

  // Try to connect with retries
  while (retryCount < MAX_RETRIES && !connected) {
    connected = await attemptConnection();

    if (!connected) {
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        const delay = retryCount * 3000; // Increasing delay between retries
        console.log(`⏳ Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Set up event handlers for the connection if successful
  if (connected) {
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('🔌 MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected successfully');
    });

    return true;
  } else {
    console.error(`❌ Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
    console.warn("⚠️ Using in-memory database for development");
    console.warn("⚠️ All data will be lost when the server restarts");
    console.warn("⚠️ Please fix the MongoDB connection issues for production use");

    // Set up a mock mongoose connection for compatibility
    mongoose.connection = {
      on: () => {},
      readyState: 1,
      name: 'in-memory-db',
      host: 'localhost',
      db: inMemoryDb
    };

    // Return true to indicate that we have a "working" database (the in-memory fallback)
    return true;
  }
};

export default connectDB;