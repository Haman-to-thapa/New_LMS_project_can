import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

/**
 * Test MongoDB connection
 * This script tests the MongoDB connection independently of the main application
 */
const testConnection = async () => {
  console.log('🔍 MongoDB Connection Test');
  console.log('==========================');
  
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      console.error("Please check your .env file and add a valid MONGO_URI");
      process.exit(1);
    }
    
    // Get connection string and mask sensitive parts for logging
    const connectionString = process.env.MONGO_URI;
    const maskedConnectionString = connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    
    console.log(`📡 Connection string: ${maskedConnectionString}`);
    
    // Check connection string format
    if (connectionString.includes('mongodb+srv')) {
      console.log('🌐 Connection type: MongoDB Atlas (Cloud)');
    } else if (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
      console.log('💻 Connection type: Local MongoDB');
    } else {
      console.log('🖥️ Connection type: Custom MongoDB Server');
    }
    
    // Set up mongoose connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Short timeout for testing
      socketTimeoutMS: 45000,
    };
    
    console.log('⏳ Attempting to connect...');
    
    // Connect to MongoDB
    const start = Date.now();
    await mongoose.connect(connectionString, options);
    const connectionTime = Date.now() - start;
    
    // Get database details
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;
    const port = mongoose.connection.port;
    
    console.log(`✅ Successfully connected in ${connectionTime}ms!`);
    console.log(`📊 Database name: ${dbName}`);
    console.log(`🖥️ Host: ${host}${port ? ':' + port : ''}`);
    
    // Check database status
    const adminDb = mongoose.connection.db.admin();
    const serverStatus = await adminDb.serverStatus();
    
    console.log(`📈 MongoDB version: ${serverStatus.version}`);
    console.log(`🔄 Uptime: ${Math.floor(serverStatus.uptime / 3600)} hours, ${Math.floor((serverStatus.uptime % 3600) / 60)} minutes`);
    console.log(`📝 Connections: ${serverStatus.connections.current} current, ${serverStatus.connections.available} available`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('👋 Connection closed');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error(`  Error: ${error.message}`);
      
      // Check if it's an authentication error
      if (error.message.includes('Authentication failed')) {
        console.error("\n🔐 Authentication Error: Your username or password is incorrect");
        console.error("Please check your MongoDB Atlas credentials in the .env file");
      }
      
      // Check if it's a network error
      if (error.message.includes('ECONNREFUSED')) {
        console.error("\n🌐 Connection Refused: Could not connect to the MongoDB server");
        if (process.env.MONGO_URI.includes('localhost')) {
          console.error("If you're using a local MongoDB, make sure it's running");
        } else {
          console.error("If you're using MongoDB Atlas, check your network connection and firewall settings");
        }
      }
      
      // Check if it's an IP whitelist error
      if (error.message.includes('IP address is not allowed')) {
        console.error("\n🛡️ IP Whitelist Error: Your current IP address is not allowed to access the database");
        console.error("Please add your IP address to the MongoDB Atlas whitelist");
        console.error("1. Go to MongoDB Atlas dashboard");
        console.error("2. Navigate to Network Access");
        console.error("3. Click 'Add IP Address'");
        console.error("4. Add your current IP or use '0.0.0.0/0' for development");
      }
      
      console.error("\n🔧 Possible solutions:");
      console.error("1. Check if your IP is whitelisted in MongoDB Atlas");
      console.error("2. Verify your username and password");
      console.error("3. Make sure your MongoDB Atlas cluster is running");
      console.error("4. Try using a local MongoDB instance for development");
      console.error("5. Check your network connection and firewall settings");
    } else {
      console.error(`  Error: ${error.message}`);
    }
  } finally {
    // Ensure the process exits
    process.exit(0);
  }
};

// Run the test
testConnection();
