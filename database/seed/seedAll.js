import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

import { User, Application, Document, Course, Registration, Result } from '../schemas/index.js';
import usersSeedData from './usersData.js';
import applicationsSeedData from './applicationsData.js';
import documentsSeedData from './documentsData.js';
import coursesSeedData from './coursesData.js';
import registrationsSeedData from './registrationsData.js';
import resultsSeedData from './resultsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/universityDB';

export const seedDatabase = async () => {
  console.log('='.repeat(70));
  console.log('🌱 STARTING UNIVERSITY DATABASE SEEDING ENGINE');
  console.log('='.repeat(70));
  console.log(`📡 Connecting to MongoDB at: ${MONGO_URI}...`);

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected successfully to MongoDB.\n');

  try {
    // 1. Clear existing collections
    console.log('🧹 Purging existing collections...');
    await Result.deleteMany({});
    await Registration.deleteMany({});
    await Course.deleteMany({});
    await Document.deleteMany({});
    await Application.deleteMany({});
    await User.deleteMany({});
    console.log('✅ All target collections wiped clean.\n');

    // 2. Hash passwords for users and seed
    console.log('👥 Seeding Users collection...');
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash('password123', salt);

    const usersToInsert = usersSeedData.map((u) => ({
      ...u,
      password: defaultHashedPassword,
    }));

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Seeded ${insertedUsers.length} Users.`);

    // 3. Seed Applications
    console.log('📄 Seeding Applications collection...');
    const insertedApplications = await Application.insertMany(applicationsSeedData);
    console.log(`✅ Seeded ${insertedApplications.length} Applications.`);

    // 4. Seed Documents
    console.log('📁 Seeding Documents collection...');
    const insertedDocuments = await Document.insertMany(documentsSeedData);
    console.log(`✅ Seeded ${insertedDocuments.length} Documents.`);

    // 5. Seed Courses
    console.log('📚 Seeding Courses collection...');
    const insertedCourses = await Course.insertMany(coursesSeedData);
    console.log(`✅ Seeded ${insertedCourses.length} Courses.`);

    // 6. Seed Registrations
    console.log('📝 Seeding Registrations collection...');
    const insertedRegistrations = await Registration.insertMany(registrationsSeedData);
    console.log(`✅ Seeded ${insertedRegistrations.length} Registrations.`);

    // 7. Seed Results
    console.log('🏆 Seeding Results collection...');
    const insertedResults = await Result.insertMany(resultsSeedData);
    console.log(`✅ Seeded ${insertedResults.length} Results.\n`);

    // 8. Build and Sync Indexes
    console.log('⚡ Synchronizing and Building Indexes on all collections...');
    await Promise.all([
      User.syncIndexes(),
      Application.syncIndexes(),
      Document.syncIndexes(),
      Course.syncIndexes(),
      Registration.syncIndexes(),
      Result.syncIndexes(),
    ]);
    console.log('✅ All collection indexes verified and synced.\n');

    // 9. Summary Report
    console.log('='.repeat(70));
    console.log('📊 DATABASE SEEDING SUMMARY');
    console.log('='.repeat(70));
    console.log(`- Total Users:         ${insertedUsers.length} (Students: ${insertedUsers.filter(u => u.role === 'STUDENT').length}, Faculty: 1, Officer: 1, Admin: 1)`);
    console.log(`- Total Applications:  ${insertedApplications.length} (Approved: ${insertedApplications.filter(a => a.status === 'APPROVED').length}, Pending: ${insertedApplications.filter(a => a.status === 'PENDING').length}, Rejected: ${insertedApplications.filter(a => a.status === 'REJECTED').length})`);
    console.log(`- Total Documents:     ${insertedDocuments.length} (Verified: ${insertedDocuments.filter(d => d.verified).length}, Pending: ${insertedDocuments.filter(d => !d.verified).length})`);
    console.log(`- Total Courses:       ${insertedCourses.length}`);
    console.log(`- Total Registrations: ${insertedRegistrations.length}`);
    console.log(`  * CS301 (DBMS):      ${insertedRegistrations.filter(r => r.courseId.toString() === insertedCourses.find(c => c.code === 'CS301')._id.toString() && r.status === 'ENROLLED').length} Enrolled (100% capacity), ${insertedRegistrations.filter(r => r.courseId.toString() === insertedCourses.find(c => c.code === 'CS301')._id.toString() && r.status === 'WAITLISTED').length} Waitlisted`);
    console.log(`  * ML301 (ML):        ${insertedRegistrations.filter(r => r.courseId.toString() === insertedCourses.find(c => c.code === 'ML301')._id.toString() && r.status === 'ENROLLED').length} Enrolled`);
    console.log(`  * CS302 (OS):        ${insertedRegistrations.filter(r => r.courseId.toString() === insertedCourses.find(c => c.code === 'CS302')._id.toString() && r.status === 'ENROLLED').length} Enrolled, 1 Dropped`);
    console.log(`- Total Results:       ${insertedResults.length} (Student 1 has ML301 prerequisite completed)`);
    console.log('='.repeat(70));
    console.log('🚀 DATABASE READY FOR PRODUCTION & TESTING');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
};

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
