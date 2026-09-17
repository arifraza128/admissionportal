import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Application from '../models/Application.js';
import Document from '../models/Document.js';
import Registration from '../models/Registration.js';
import Result from '../models/Result.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Application.deleteMany({}),
      Document.deleteMany({}),
      Registration.deleteMany({}),
      Result.deleteMany({}),
    ]);

    console.log('[Seed] Creating initial users...');
    const users = await User.create([
      {
        name: 'Arif Raza',
        email: 'arif@example.com',
        password: 'password123',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        studentId: 'STU-2026-8801',
      },
      {
        name: 'Eleanor Vance',
        email: 'officer@example.com',
        password: 'password123',
        role: 'ADMISSION_OFFICER',
        department: 'Office of Admissions',
        officerId: 'ADM-OFF-102',
      },
      {
        name: 'Dr. Robert Oppen',
        email: 'faculty@example.com',
        password: 'password123',
        role: 'FACULTY',
        department: 'Computer Science & Engineering',
        facultyId: 'FAC-CS-401',
      },
      {
        name: 'System Administrator',
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN',
        department: 'Central IT & Operations',
        adminId: 'ADM-ROOT-001',
      },
    ]);

    const studentArif = users[0];
    const facultyRobert = users[2];

    console.log('[Seed] Creating curriculum courses (matching specifications)...');
    const courses = await Course.create([
      {
        code: 'CS301',
        name: 'Database Systems',
        capacity: 40,
        faculty: 'Dr. Robert Oppen',
        facultyId: facultyRobert._id,
        credits: 4,
        prerequisites: [],
        schedule: {
          day: 'Monday',
          start: '10:00',
          end: '11:00',
        },
        room: 'Hall B-204',
        department: 'Computer Science',
        description: 'Relational algebra, SQL mastery, transaction indexing, and ACID properties.',
      },
      {
        code: 'ML301',
        name: 'Machine Learning',
        capacity: 40,
        faculty: 'Dr. Sophia Chen',
        credits: 4,
        prerequisites: [],
        schedule: {
          day: 'Monday',
          start: '10:30', // Overlaps with CS301 (10:00-11:00) for conflict testing!
          end: '11:30',
        },
        room: 'Auditorium 1',
        department: 'Artificial Intelligence',
        description: 'Supervised and unsupervised learning, gradient descent, and neural networks.',
      },
      {
        code: 'CS401',
        name: 'Advanced Machine Learning',
        capacity: 40,
        faculty: 'Dr. Sophia Chen',
        credits: 4,
        prerequisites: ['ML301'],
        schedule: {
          day: 'Tuesday',
          start: '11:00',
          end: '12:00',
        },
        room: 'AI Lab 3',
        department: 'Artificial Intelligence',
        description: 'Deep neural networks, transformers, and reinforcement learning pipelines.',
      },
      {
        code: 'CS320',
        name: 'Computer Networks',
        capacity: 40,
        faculty: 'Prof. Marcus Vance',
        credits: 3,
        prerequisites: [],
        schedule: {
          day: 'Thursday',
          start: '13:00',
          end: '14:30',
        },
        room: 'Hall C-102',
        department: 'Computer Science',
        description: 'TCP/IP stack, socket programming, and distributed systems.',
      },
      {
        code: 'CS450',
        name: 'Cloud Computing & DevOps',
        capacity: 40,
        faculty: 'Dr. Robert Oppen',
        credits: 3,
        prerequisites: [],
        schedule: {
          day: 'Friday',
          start: '10:30',
          end: '12:00',
        },
        room: 'Cloud Sandbox Lab',
        department: 'Computer Science',
        description: 'Containerization, Kubernetes, CI/CD pipelines, and microservices.',
      },
    ]);

    console.log('[Seed] Creating student admission dossier...');
    await Application.create([
      {
        studentId: studentArif._id,
        applicantName: studentArif.name,
        email: studentArif.email,
        phone: '+1 (555) 382-9901',
        program: 'B.Sc. Computer Science & Engineering',
        term: 'Fall 2026',
        status: 'APPROVED',
        highSchool: 'Apex International Academy',
        gpaScore: '3.92 / 4.00',
        satScore: '1480',
        statementOfPurpose: 'Passionate about computer systems and scalable distributed software.',
        reviewedBy: 'Eleanor Vance',
        reviewDate: new Date(),
        reviewerNotes: 'Strong academic performance. Admission approved with honors scholarship consideration.',
      },
    ]);

    console.log('[Seed] Creating initial document uploads...');
    await Document.create([
      {
        studentId: studentArif._id,
        fileName: 'Official_HighSchool_Transcript.pdf',
        originalName: 'Official_HighSchool_Transcript.pdf',
        documentType: 'Academic Transcript',
        fileUrl: '/uploads/sample_transcript.pdf',
        fileSize: '2.4 MB',
        mimeType: 'application/pdf',
        status: 'VERIFIED',
      },
      {
        studentId: studentArif._id,
        fileName: 'National_ID_Passport_Copy.pdf',
        originalName: 'National_ID_Passport_Copy.pdf',
        documentType: 'Government Identity Proof',
        fileUrl: '/uploads/sample_id.pdf',
        fileSize: '1.1 MB',
        mimeType: 'application/pdf',
        status: 'VERIFIED',
      },
    ]);

    console.log('[Seed] Database seeded successfully!');
    if (process.argv[1].endsWith('seed.js')) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Failed to seed database:', error);
    if (process.argv[1].endsWith('seed.js')) {
      process.exit(1);
    }
  }
};

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}

export default seedDatabase;
