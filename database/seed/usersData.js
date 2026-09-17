import mongoose from 'mongoose';

/**
 * Deterministic ObjectIds for core system actors
 */
export const USER_IDS = {
  STUDENT_ARIF: new mongoose.Types.ObjectId('65a000000000000000010001'),
  FACULTY_RAHUL: new mongoose.Types.ObjectId('65a000000000000000020001'),
  FACULTY_GENERIC: new mongoose.Types.ObjectId('65a000000000000000020002'),
  OFFICER_PRIYA: new mongoose.Types.ObjectId('65a000000000000000030001'),
  OFFICER_GENERIC: new mongoose.Types.ObjectId('65a000000000000000030002'),
  ADMIN_SYSTEM: new mongoose.Types.ObjectId('65a000000000000000040001'),
};

// Generate deterministic IDs for students 1 through 50
export const getStudentId = (index) => {
  const hex = index.toString(16).padStart(4, '0');
  return new mongoose.Types.ObjectId(`65a00000000000000001${hex}`);
};

export const usersSeedData = [
  // 1. Core Role: STUDENT (Student 1)
  {
    _id: USER_IDS.STUDENT_ARIF,
    name: 'Arif Raza',
    email: 'arif@example.com',
    password: 'password123',
    role: 'STUDENT',
    createdAt: new Date('2026-08-01T08:00:00Z'),
  },
  // 2. Core Role: FACULTY (Dr. Rahul Sharma)
  {
    _id: USER_IDS.FACULTY_RAHUL,
    name: 'Dr. Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'password123',
    role: 'FACULTY',
    createdAt: new Date('2026-07-15T08:00:00Z'),
  },
  // 2b. Core Role: FACULTY alias (faculty@example.com)
  {
    _id: USER_IDS.FACULTY_GENERIC,
    name: 'Faculty Demo User',
    email: 'faculty@example.com',
    password: 'password123',
    role: 'FACULTY',
    createdAt: new Date('2026-07-15T08:00:00Z'),
  },
  // 3. Core Role: ADMISSION_OFFICER (Priya Singh)
  {
    _id: USER_IDS.OFFICER_PRIYA,
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    password: 'password123',
    role: 'ADMISSION_OFFICER',
    createdAt: new Date('2026-07-10T08:00:00Z'),
  },
  // 3b. Core Role: ADMISSION_OFFICER alias (officer@example.com)
  {
    _id: USER_IDS.OFFICER_GENERIC,
    name: 'Admission Officer Demo',
    email: 'officer@example.com',
    password: 'password123',
    role: 'ADMISSION_OFFICER',
    createdAt: new Date('2026-07-10T08:00:00Z'),
  },
  // 4. Core Role: ADMIN (System Admin)
  {
    _id: USER_IDS.ADMIN_SYSTEM,
    name: 'System Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'ADMIN',
    createdAt: new Date('2026-07-01T08:00:00Z'),
  },
];

// Generate Students 2 to 45 (Total 45 student records for deep capacity and waitlist testing)
const studentNames = [
  'Aarav Patel', 'Aditi Rao', 'Akash Gupta', 'Ananya Deshmukh', 'Arman Malik',
  'Bhavna Iyer', 'Chetan Bhagat', 'Deepak Verma', 'Divya Nair', 'Esha Deol',
  'Farhan Akhtar', 'Gaurav Khanna', 'Harshita Gaur', 'Ishaan Khatter', 'Jaya Bachchan',
  'Kabir Bedi', 'Kavita Krishnamurthy', 'Lalit Modi', 'Manish Malhotra', 'Neha Dhupia',
  'Om Puri', 'Pooja Hegde', 'Pranav Roy', 'Radhika Apte', 'Raghav Juyal',
  'Rohan Mehra', 'Sameer Anjaan', 'Sananya Irani', 'Siddharth Roy', 'Simran Kaur',
  'Tanmay Bhat', 'Tara Sutaria', 'Udit Narayan', 'Varun Dhawan', 'Vidya Balan',
  'Vikramaditya Motwane', 'Yash Chopra', 'Zoya Akhtar', 'Nikhil Advani', 'Rhea Chakraborty',
  'Student Forty One', 'Student Forty Two', 'Student Forty Three', 'Student Forty Four'
];

studentNames.forEach((name, idx) => {
  const studentNumber = idx + 2;
  usersSeedData.push({
    _id: getStudentId(studentNumber),
    name: name,
    email: `student${studentNumber}@example.com`,
    password: 'password123',
    role: 'STUDENT',
    createdAt: new Date('2026-08-01T09:00:00Z'),
  });
});

export default usersSeedData;
