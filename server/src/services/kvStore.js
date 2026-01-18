import { getDb } from '../config/database.js';

/**
 * MongoDB-based Key-Value Store
 * This provides compatibility with the previous Supabase KV interface
 */

// Set stores a key-value pair in the database.
export async function set(key, value) {
  const db = getDb();
  await db.collection('kv_store').updateOne(
    { key },
    { $set: { key, value, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Get retrieves a key-value pair from the database.
export async function get(key) {
  const db = getDb();
  const doc = await db.collection('kv_store').findOne({ key });
  return doc?.value || null;
}

// Delete deletes a key-value pair from the database.
export async function del(key) {
  const db = getDb();
  await db.collection('kv_store').deleteOne({ key });
}

// Sets multiple key-value pairs in the database.
export async function mset(keys, values) {
  const db = getDb();
  const operations = keys.map((key, i) => ({
    updateOne: {
      filter: { key },
      update: { $set: { key, value: values[i], updatedAt: new Date() } },
      upsert: true
    }
  }));
  await db.collection('kv_store').bulkWrite(operations);
}

// Gets multiple key-value pairs from the database.
export async function mget(keys) {
  const db = getDb();
  const docs = await db.collection('kv_store').find({ key: { $in: keys } }).toArray();
  const valueMap = new Map(docs.map(d => [d.key, d.value]));
  return keys.map(key => valueMap.get(key) || null);
}

// Deletes multiple key-value pairs from the database.
export async function mdel(keys) {
  const db = getDb();
  await db.collection('kv_store').deleteMany({ key: { $in: keys } });
}

// Search for key-value pairs by prefix.
export async function getByPrefix(prefix) {
  const db = getDb();
  const docs = await db.collection('kv_store').find({ 
    key: { $regex: `^${prefix}` } 
  }).toArray();
  return docs.map(d => d.value);
}
