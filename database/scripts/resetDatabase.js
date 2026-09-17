import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/universityDB';

export const resetDatabase = async () => {
  console.log('='.repeat(70));
  console.log('🚨 RESETTING UNIVERSITY DATABASE');
  console.log('='.repeat(70));
  console.log(`Connecting to ${MONGO_URI}...`);

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB.');

  const collections = ['users', 'applications', 'documents', 'courses', 'registrations', 'results'];

  for (const colName of collections) {
    try {
      await mongoose.connection.collection(colName).drop();
      console.log(`🗑️  Dropped collection: ${colName}`);
    } catch (err) {
      if (err.code === 26) {
        console.log(`ℹ️  Collection ${colName} did not exist, skipped.`);
      } else {
        console.warn(`⚠️  Warning on collection ${colName}:`, err.message);
      }
    }
  }

  await mongoose.disconnect();
  console.log('='.repeat(70));
  console.log('✨ DATABASE PURGED SUCCESSFULLY');
  console.log('='.repeat(70));
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  resetDatabase().catch((err) => {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  });
}
