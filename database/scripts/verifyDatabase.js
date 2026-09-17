import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { User, Application, Document, Course, Registration, Result } from '../schemas/index.js';
import { USER_IDS } from '../seed/usersData.js';
import { COURSE_IDS } from '../seed/coursesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/universityDB';

export const verifyDatabase = async () => {
  console.log('='.repeat(70));
  console.log('🔍 UNIVERSITY DATABASE INTEGRITY & SCENARIO VERIFICATION');
  console.log('='.repeat(70));

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB.\n');

  let passedTests = 0;
  let totalTests = 0;

  const test = (description, condition) => {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${description}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${description}`);
    }
  };

  try {
    // -------------------------------------------------------------
    // TEST SUITE 1: Collection Counts & Seeded Entities
    // -------------------------------------------------------------
    console.log('📋 Test Suite 1: Collection Counts & Core Entities');
    const userCount = await User.countDocuments();
    const appCount = await Application.countDocuments();
    const docCount = await Document.countDocuments();
    const courseCount = await Course.countDocuments();
    const regCount = await Registration.countDocuments();
    const resCount = await Result.countDocuments();

    test('Users count >= 45', userCount >= 45);
    test('Applications count >= 45', appCount >= 45);
    test('Documents count >= 45', docCount >= 45);
    test('Courses count == 4', courseCount === 4);
    test('Registrations count >= 40', regCount >= 40);
    test('Results count >= 10', resCount >= 10);

    // Verify key actors
    const arif = await User.findOne({ email: 'arif@example.com' });
    const rahul = await User.findOne({ email: 'rahul.sharma@example.com' });
    const priya = await User.findOne({ email: 'priya.singh@example.com' });
    const admin = await User.findOne({ email: 'admin@example.com' });

    test('Student Arif exists with role STUDENT', arif && arif.role === 'STUDENT');
    test('Faculty Rahul exists with role FACULTY', rahul && rahul.role === 'FACULTY');
    test('Officer Priya exists with role ADMISSION_OFFICER', priya && priya.role === 'ADMISSION_OFFICER');
    test('Admin exists with role ADMIN', admin && admin.role === 'ADMIN');
    console.log('');

    // -------------------------------------------------------------
    // TEST SUITE 2: Referential Integrity (No Orphaned Records)
    // -------------------------------------------------------------
    console.log('🔗 Test Suite 2: Referential Integrity');
    
    // Check all applications refer to existing users
    const apps = await Application.find();
    let orphanedApps = 0;
    for (const app of apps) {
      const user = await User.findById(app.studentId);
      if (!user) orphanedApps++;
    }
    test('All applications map to valid users (no orphans)', orphanedApps === 0);

    // Check all documents refer to existing users
    const docs = await Document.find();
    let orphanedDocs = 0;
    for (const doc of docs) {
      const user = await User.findById(doc.studentId);
      if (!user) orphanedDocs++;
    }
    test('All documents map to valid users (no orphans)', orphanedDocs === 0);

    // Check all courses refer to valid faculty
    const courses = await Course.find();
    let invalidFaculty = 0;
    for (const c of courses) {
      const fac = await User.findOne({ _id: c.facultyId, role: 'FACULTY' });
      if (!fac) invalidFaculty++;
    }
    test('All courses map to valid FACULTY users', invalidFaculty === 0);

    // Check all registrations map to valid users and courses
    const regs = await Registration.find();
    let orphanedRegs = 0;
    for (const r of regs) {
      const user = await User.findById(r.studentId);
      const course = await Course.findById(r.courseId);
      if (!user || !course) orphanedRegs++;
    }
    test('All registrations map to valid users and courses', orphanedRegs === 0);
    console.log('');

    // -------------------------------------------------------------
    // TEST SUITE 3: Capacity & Waitlist Verification (CS301)
    // -------------------------------------------------------------
    console.log('📈 Test Suite 3: Capacity & Waitlist Constraints (CS301)');
    const cs301 = await Course.findOne({ code: 'CS301' });
    const cs301Enrolled = await Registration.countDocuments({
      courseId: cs301._id,
      status: 'ENROLLED',
    });
    const cs301Waitlisted = await Registration.find({
      courseId: cs301._id,
      status: 'WAITLISTED',
    }).sort({ waitlistPosition: 1 });

    test('CS301 enrolled students count exactly matches capacity (40/40)', cs301Enrolled === 40);
    test('CS301 has waitlisted students beyond capacity', cs301Waitlisted.length >= 2);
    test('41st student is at waitlist position 1', cs301Waitlisted[0]?.waitlistPosition === 1);
    test('42nd student is at waitlist position 2', cs301Waitlisted[1]?.waitlistPosition === 2);
    console.log('');

    // -------------------------------------------------------------
    // TEST SUITE 4: Timetable Overlap Collision Logic
    // -------------------------------------------------------------
    console.log('⏰ Test Suite 4: Timetable Collision Logic Verification');
    const ml301 = await Course.findOne({ code: 'ML301' });

    // CS301: Mon 10:00 - 11:00, ML301: Mon 10:30 - 11:30
    const checkScheduleOverlap = (s1, s2) => {
      if (s1.day !== s2.day) return false;
      return s1.start < s2.end && s2.start < s1.end;
    };

    const isOverlap = checkScheduleOverlap(cs301.schedule, ml301.schedule);
    test('Timetable collision correctly flagged between CS301 (10:00-11:00) and ML301 (10:30-11:30)', isOverlap === true);

    const cs302 = await Course.findOne({ code: 'CS302' }); // Mon 12:00 - 13:00
    const isOverlapCS302 = checkScheduleOverlap(cs301.schedule, cs302.schedule);
    test('Non-overlapping courses correctly identified (CS301 vs CS302)', isOverlapCS302 === false);
    console.log('');

    // -------------------------------------------------------------
    // TEST SUITE 5: Prerequisites Rule Engine Verification (CS401)
    // -------------------------------------------------------------
    console.log('🎓 Test Suite 5: Prerequisite Checking Logic (CS401)');
    const cs401 = await Course.findOne({ code: 'CS401' }); // Requires ML301

    // Student 1 (Arif) prerequisite check
    const checkStudentPrerequisites = async (studentId, course) => {
      if (!course.prerequisites || course.prerequisites.length === 0) return true;
      const completedResults = await Result.find({
        studentId,
        status: 'COMPLETED',
      }).populate('courseId');

      const completedCodes = completedResults.map(r => r.courseId?.code);
      return course.prerequisites.every(prereq => completedCodes.includes(prereq));
    };

    const arifEligibleForCS401 = await checkStudentPrerequisites(USER_IDS.STUDENT_ARIF, cs401);
    test('Student Arif has completed ML301 and is eligible for CS401', arifEligibleForCS401 === true);

    // Student 41 (No ML301) prerequisite check
    const student41 = await User.findOne({ email: 'student41@example.com' });
    const student41EligibleForCS401 = await checkStudentPrerequisites(student41._id, cs401);
    test('Student 41 has not completed ML301 and is correctly blocked from CS401', student41EligibleForCS401 === false);
    console.log('');

    // -------------------------------------------------------------
    // TEST SUITE 6: Database Indexes Verification
    // -------------------------------------------------------------
    console.log('⚡ Test Suite 6: Database Indexes Verification');
    const userIndexes = await User.collection.indexes();
    const courseIndexes = await Course.collection.indexes();
    const appIndexes = await Application.collection.indexes();
    const regIndexes = await Registration.collection.indexes();
    const resIndexes = await Result.collection.indexes();

    const hasUserEmailIndex = userIndexes.some(idx => idx.key.email === 1 && idx.unique);
    const hasCourseCodeIndex = courseIndexes.some(idx => idx.key.code === 1 && idx.unique);
    const hasAppStudentIndex = appIndexes.some(idx => idx.key.studentId === 1);
    const hasRegCompoundIndex = regIndexes.some(idx => idx.key.studentId === 1 && idx.key.courseId === 1 && idx.unique);
    const hasResCompoundIndex = resIndexes.some(idx => idx.key.studentId === 1 && idx.key.courseId === 1 && idx.unique);

    test('User collection has unique index on email', hasUserEmailIndex);
    test('Course collection has unique index on code', hasCourseCodeIndex);
    test('Application collection has index on studentId', hasAppStudentIndex);
    test('Registration collection has unique compound index on { studentId, courseId }', hasRegCompoundIndex);
    test('Result collection has unique compound index on { studentId, courseId }', hasResCompoundIndex);
    console.log('');

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('='.repeat(70));
    console.log(`🏁 VERIFICATION COMPLETE: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('='.repeat(70));

  } catch (err) {
    console.error('❌ Verification Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifyDatabase().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
