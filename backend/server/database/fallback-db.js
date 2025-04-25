/**
 * Fallback in-memory database for development when MongoDB is unavailable
 * This provides a simple in-memory store that mimics basic MongoDB functionality
 * WARNING: This is for development only and data will be lost when the server restarts
 */

class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.documents = [];
    this.nextId = 1;
    console.log(`📝 Created in-memory collection: ${name}`);
  }

  // Create a new document
  async create(data) {
    const id = this.nextId++;
    const _id = `mock_${id}`;
    const document = { _id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.documents.push(document);
    console.log(`➕ Added document to ${this.name}: ${_id}`);
    return document;
  }

  // Find documents matching a query
  async find(query = {}) {
    // Simple filtering based on exact matches in the query object
    return this.documents.filter(doc => {
      return Object.entries(query).every(([key, value]) => {
        if (key === '_id') {
          return doc._id === value;
        }
        return doc[key] === value;
      });
    });
  }

  // Find a single document
  async findOne(query = {}) {
    return this.find(query).then(results => results[0] || null);
  }

  // Find by ID
  async findById(id) {
    return this.findOne({ _id: id });
  }

  // Update a document
  async findByIdAndUpdate(id, update) {
    const index = this.documents.findIndex(doc => doc._id === id);
    if (index === -1) return null;

    // Handle $set operator
    if (update.$set) {
      Object.entries(update.$set).forEach(([key, value]) => {
        this.documents[index][key] = value;
      });
      delete update.$set;
    }

    // Handle $addToSet operator
    if (update.$addToSet) {
      Object.entries(update.$addToSet).forEach(([key, value]) => {
        if (!this.documents[index][key]) {
          this.documents[index][key] = [];
        }
        if (!this.documents[index][key].includes(value)) {
          this.documents[index][key].push(value);
        }
      });
      delete update.$addToSet;
    }

    // Apply remaining direct updates
    Object.entries(update).forEach(([key, value]) => {
      if (!key.startsWith('$')) {
        this.documents[index][key] = value;
      }
    });

    this.documents[index].updatedAt = new Date();
    console.log(`🔄 Updated document in ${this.name}: ${id}`);
    return this.documents[index];
  }

  // Delete a document
  async findByIdAndDelete(id) {
    const index = this.documents.findIndex(doc => doc._id === id);
    if (index === -1) return null;

    const deleted = this.documents.splice(index, 1)[0];
    console.log(`❌ Deleted document from ${this.name}: ${id}`);
    return deleted;
  }

  // Count documents
  async countDocuments(query = {}) {
    return this.find(query).then(results => results.length);
  }
}

// Main database class
class InMemoryDatabase {
  constructor() {
    this.collections = {};
    console.log('🧠 Initialized in-memory database');
  }

  // Get or create a collection
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new InMemoryCollection(name);
    }
    return this.collections[name];
  }

  // Get all collection names
  getCollectionNames() {
    return Object.keys(this.collections);
  }

  // Clear all data (for testing)
  clear() {
    Object.keys(this.collections).forEach(name => {
      this.collections[name].documents = [];
    });
    console.log('🧹 Cleared all in-memory database collections');
  }
}

// Create the database instance
const inMemoryDb = new InMemoryDatabase();

// Import mock data
import { mockUsers, mockCourses, mockLectures, mockPurchases } from './mock-data.js';

// Function to initialize the database with mock data
const initializeWithMockData = async () => {
  console.log('🔄 Initializing in-memory database with mock data...');

  // Create collections
  const userCollection = inMemoryDb.collection('users');
  const courseCollection = inMemoryDb.collection('courses');
  const lectureCollection = inMemoryDb.collection('lectures');
  const purchaseCollection = inMemoryDb.collection('coursepurchases');

  // Add mock users
  for (const user of mockUsers) {
    await userCollection.create(user);
  }

  // Add mock courses
  for (const course of mockCourses) {
    await courseCollection.create(course);
  }

  // Add mock lectures
  for (const lecture of mockLectures) {
    await lectureCollection.create(lecture);
  }

  // Add mock purchases
  for (const purchase of mockPurchases) {
    await purchaseCollection.create(purchase);
  }

  console.log('✅ Mock data loaded successfully');
};

// Initialize with mock data
initializeWithMockData();

export default inMemoryDb;
