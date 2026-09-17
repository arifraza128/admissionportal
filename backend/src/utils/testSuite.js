import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Application from '../models/Application.js';
import Registration from '../models/Registration.js';
import Result from '../models/Result.js';

import { registerUser, loginUser } from '../services/authService.js';
import { applyAdmission, approveApplication } from '../services/admissionService.js';
import { getAllCourses } from '../services/courseService.js';
import { registerForCourse, getMyRegistrations } from '../services/registrationService.js';
import { getStudentTimetable } from '../services/timetableService.js';
import { createResult, getResults } from '../services/resultService.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const runIntegrationTestSuite = async () => {
  console.log('================================================================');
  console.log('🧪 RUNNING 18-STEP BACKEND INTEGRATION TEST SUITE');
  console.log('================================================================');

  let passedSteps = 0;
  let totalSteps = 18;

  try {
    // Connect & Reset DB
    await connectDB();
    await seedDatabase();

    // Step 1: Register student
    console.log('\n▶ Step 1: Register student');
    const studentData = {
      name: 'Test Student One',
      email: `student_${Date.now()}@example.com`,
      password: 'password123',
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
    };
    const regResult = await registerUser(studentData);
    console.log(`✓ Registered student: ${regResult.user.email} (ID: ${regResult.user._id})`);
    passedSteps++;

    // Step 2: Login
    console.log('\n▶ Step 2: Login');
    const loginResult = await loginUser({
      email: studentData.email,
      password: studentData.password,
    });
    console.log(`✓ Login success. Token acquired: ${loginResult.token.substring(0, 20)}...`);
    const studentUser = loginResult.user;
    passedSteps++;

    // Step 3: Apply admission
    console.log('\n▶ Step 3: Apply admission');
    const application = await applyAdmission(studentUser._id, {
      applicantName: studentUser.name,
      email: studentUser.email,
      program: 'B.Sc. Computer Science & Engineering',
      term: 'Fall 2026',
      highSchool: 'Tech High',
      gpaScore: '3.95 / 4.00',
    });
    console.log(`✓ Application submitted. Status: ${application.status} (ID: ${application._id})`);
    passedSteps++;

    // Step 4: Approve admission
    console.log('\n▶ Step 4: Approve admission');
    const approvedApp = await approveApplication(application._id, {
      reviewedBy: 'Eleanor Vance',
      reviewerNotes: 'Verified and approved.',
    });
    console.log(`✓ Application approved. Current status: ${approvedApp.status}`);
    passedSteps++;

    // Step 5: Get courses
    console.log('\n▶ Step 5: Get courses');
    const courses = await getAllCourses();
    console.log(`✓ Retrieved ${courses.length} courses from catalog.`);
    const dbSystems = courses.find((c) => c.code === 'CS301');
    const machineLearning = courses.find((c) => c.code === 'ML301');
    const advML = courses.find((c) => c.code === 'CS401');
    const networks = courses.find((c) => c.code === 'CS320');
    passedSteps++;

    // Step 6: Register available course
    console.log('\n▶ Step 6: Register available course (CS301 - Database Systems)');
    const cs301Reg = await registerForCourse(studentUser._id, dbSystems._id);
    if (cs301Reg.status !== 'ENROLLED') throw new Error(`Expected ENROLLED, got ${cs301Reg.status}`);
    console.log(`✓ Registration success: ${cs301Reg.status} - "${cs301Reg.message}"`);
    passedSteps++;

    // Step 7: Fill Database Systems to capacity (40 students)
    console.log('\n▶ Step 7: Fill Database Systems to capacity');
    const bulkStudents = [];
    for (let i = 2; i <= 40; i++) {
      bulkStudents.push(
        new Registration({
          studentId: new mongoose.Types.ObjectId(),
          courseId: dbSystems._id,
          status: 'ENROLLED',
          semester: 'Fall 2026',
        })
      );
    }
    await Registration.insertMany(bulkStudents);
    const countCS301 = await Registration.countDocuments({ courseId: dbSystems._id, status: 'ENROLLED' });
    console.log(`✓ Filled CS301 enrollment to: ${countCS301} / ${dbSystems.capacity}`);
    passedSteps++;

    // Step 8 & 9: Register Student 41 & Verify WAITLISTED
    console.log('\n▶ Step 8 & 9: Register Student 41 and verify WAITLISTED');
    const student41 = await User.create({
      name: 'Student Forty One',
      email: `student41_${Date.now()}@example.com`,
      password: 'password123',
      role: 'STUDENT',
    });
    await Application.create({
      studentId: student41._id,
      applicantName: student41.name,
      email: student41.email,
      program: 'B.Sc. Computer Science',
      status: 'APPROVED',
    });
    const reg41Result = await registerForCourse(student41._id, dbSystems._id);
    if (reg41Result.status !== 'WAITLISTED') {
      throw new Error(`Expected WAITLISTED for student 41, got ${reg41Result.status}`);
    }
    console.log(`✓ Student 41 registered: ${reg41Result.status} - "${reg41Result.message}"`);
    passedSteps += 2;

    // Step 10 & 11: Try Advanced Machine Learning without prerequisite & Verify REJECTED
    console.log('\n▶ Step 10 & 11: Try Advanced Machine Learning (CS401) without prerequisite');
    const advMLAttempt1 = await registerForCourse(studentUser._id, advML._id);
    if (advMLAttempt1.status !== 'REJECTED') {
      throw new Error(`Expected REJECTED, got ${advMLAttempt1.status}`);
    }
    console.log(`✓ Expected Rejection verified: ${advMLAttempt1.status} - "${advMLAttempt1.reason}"`);
    passedSteps += 2;

    // Step 12: Add completed Machine Learning result
    console.log('\n▶ Step 12: Add completed Machine Learning result (ML301)');
    const mlResult = await createResult({
      studentId: studentUser._id,
      studentName: studentUser.name,
      courseId: machineLearning._id,
      courseCode: 'ML301',
      courseName: 'Machine Learning',
      faculty: 'Dr. Sophia Chen',
      marks: 92,
      grade: 'A',
      gradePoint: 4.0,
      semester: 'Spring 2026',
      credits: 4,
      status: 'PUBLISHED',
      remarks: 'Prerequisite completed with distinction.',
    });
    console.log(`✓ Published prerequisite result for ML301: Grade ${mlResult.grade}`);
    passedSteps++;

    // Step 13: Try Advanced Machine Learning again (Prerequisite now satisfied!)
    console.log('\n▶ Step 13: Try Advanced Machine Learning again (Prerequisite satisfied)');
    const advMLAttempt2 = await registerForCourse(studentUser._id, advML._id);
    if (advMLAttempt2.status !== 'ENROLLED') {
      throw new Error(`Expected ENROLLED after completing prerequisite, got ${advMLAttempt2.status} (${advMLAttempt2.reason})`);
    }
    console.log(`✓ Prerequisite verified! Registered: ${advMLAttempt2.status} - "${advMLAttempt2.message}"`);
    passedSteps++;

    // Step 14 & 15: Create timetable conflict & verify rejection
    console.log('\n▶ Step 14 & 15: Create timetable conflict (CS301 Mon 10:00-11:00 vs ML301 Mon 10:30-11:30)');
    const conflictAttempt = await registerForCourse(studentUser._id, machineLearning._id);
    if (conflictAttempt.status !== 'REJECTED') {
      throw new Error(`Expected REJECTED due to timetable conflict, got ${conflictAttempt.status}`);
    }
    console.log(`✓ Timetable conflict correctly caught: ${conflictAttempt.status} - "${conflictAttempt.reason}"`);
    passedSteps += 2;

    // Step 16: Register non-conflicting course (CS320 Thursday 13:00-14:30)
    console.log('\n▶ Step 16: Register non-conflicting course (CS320 - Computer Networks)');
    const cs320Reg = await registerForCourse(studentUser._id, networks._id);
    if (cs320Reg.status !== 'ENROLLED') {
      throw new Error(`Expected ENROLLED for CS320, got ${cs320Reg.status}`);
    }
    console.log(`✓ Registered non-conflicting course: ${cs320Reg.status}`);
    passedSteps++;

    // Step 17: View timetable
    console.log('\n▶ Step 17: View timetable');
    const timetable = await getStudentTimetable(studentUser._id);
    console.log(`✓ Student timetable contains ${timetable.length} enrolled subjects:`);
    timetable.forEach((c) => console.log(`   - ${c.code}: ${c.name} (${c.schedule.day} ${c.schedule.start}-${c.schedule.end})`));
    passedSteps++;

    // Step 18: View results
    console.log('\n▶ Step 18: View results');
    const studentResults = await getResults({ studentId: studentUser._id });
    console.log(`✓ Student has ${studentResults.length} academic grade records.`);
    studentResults.forEach((r) => console.log(`   - ${r.courseCode}: ${r.grade} (${r.marks}%) - ${r.remarks}`));
    passedSteps++;

    console.log('\n================================================================');
    console.log(`🎉 ALL 18 VERIFICATION STEPS PASSED SUCCESSFULLY! (${passedSteps}/${totalSteps})`);
    console.log('================================================================');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Test Suite Failed at step ${passedSteps + 1}:`, error.message);
    process.exit(1);
  }
};

runIntegrationTestSuite();
