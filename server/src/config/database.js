import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}

const client = new MongoClient(uri);

let db = null;

export async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(); // Uses the database name from the connection string
    console.log('Connected to MongoDB Atlas');
    
    // Create indexes for better performance
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
}

async function createIndexes() {
  try {
    // Index for users collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Indexes for products collection
    await db.collection('products').createIndex({ userId: 1 });
    await db.collection('products').createIndex({ userId: 1, createdAt: -1 });
    
    // Index for kv_store collection (for any key-value data)
    await db.collection('kv_store').createIndex({ key: 1 }, { unique: true });
    
    console.log('Database indexes created');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

export async function closeConnection() {
  await client.close();
  console.log('MongoDB connection closed');
}
