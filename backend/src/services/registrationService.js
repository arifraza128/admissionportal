import mongoose from 'mongoose';
import Registration from '../models/Registration.js';
import Course from '../models/Course.js';
import Application from '../models/Application.js';
import { checkPrerequisites } from './prerequisiteService.js';
import { checkTimetableConflict } from './timetableService.js';

/**
 * 9-Step Authoritative Course Registration Engine
 * 
 * @param {string|ObjectId} studentId - Authenticated student user ID
 * @param {string|ObjectId} courseId - Course ID to register
 * @returns {Promise<{ status: string, message?: string, reason?: string, registration?: Object, isError?: boolean }>}
 */
export const registerForCourse = async (studentId, courseId) => {
  // Step 1 & 2 are handled by auth and role middlewares (STUDENT verified).

  // Step 3: Verify admission status is APPROVED
  const application = await Application.findOne({ studentId });
  if (!application || application.status !== 'APPROVED') {
    return {
      isError: true,
      statusCode: 400,
      status: 'REJECTED',
      reason: 'Student admission application is not approved. Only approved students can register courses.',
    };
  }

  // Step 4: Find Course
  let course;
  if (mongoose.Types.ObjectId.isValid(courseId)) {
    course = await Course.findById(courseId);
  } else {
    course = await Course.findOne({ code: courseId.toUpperCase() });
  }

  if (!course) {
    return {
      isError: true,
      statusCode: 404,
      status: 'REJECTED',
      reason: 'Course not found in the university catalog.',
    };
  }

  // Step 5: Check duplicate / active registration
  const existingRegistration = await Registration.findOne({
    studentId,
    courseId: course._id,
    status: { $in: ['ENROLLED', 'WAITLISTED'] },
  });

  if (existingRegistration) {
    return {
      isError: true,
      statusCode: 400,
      status: 'REJECTED',
      reason: 'Student is already registered for this course.',
    };
  }

  // Step 6: Check prerequisites against completed results
  const prereqCheck = await checkPrerequisites(studentId, course);
  if (!prereqCheck.satisfied) {
    return {
      isError: true,
      statusCode: 400,
      status: 'REJECTED',
      reason: prereqCheck.reason,
    };
  }

  // Step 7: Check timetable conflicts
  const timetableCheck = await checkTimetableConflict(studentId, course);
  if (timetableCheck.conflict) {
    return {
      isError: true,
      statusCode: 400,
      status: 'REJECTED',
      reason: timetableCheck.reason,
    };
  }

  // Step 8: Check capacity against active enrolled count
  const enrolledCount = await Registration.countDocuments({
    courseId: course._id,
    status: 'ENROLLED',
  });

  // Step 9: Create ENROLLED or WAITLISTED record
  if (enrolledCount < course.capacity) {
    // 9A: ENROLLED
    const registration = new Registration({
      studentId,
      courseId: course._id,
      status: 'ENROLLED',
      semester: 'Fall 2026',
      registeredAt: new Date(),
    });
    await registration.save();
    const populated = await Registration.findById(registration._id).populate('courseId');

    return {
      isError: false,
      statusCode: 201,
      status: 'ENROLLED',
      message: 'Course registration successful.',
      registration: populated,
    };
  } else {
    // 9B: WAITLISTED (Capacity reached)
    const registration = new Registration({
      studentId,
      courseId: course._id,
      status: 'WAITLISTED',
      semester: 'Fall 2026',
      registeredAt: new Date(),
    });
    await registration.save();
    const populated = await Registration.findById(registration._id).populate('courseId');

    return {
      isError: false,
      statusCode: 201,
      status: 'WAITLISTED',
      message: 'Course capacity reached. Student added to waitlist.',
      registration: populated,
    };
  }
};

/**
 * Retrieves all registrations for a student
 */
export const getMyRegistrations = async (studentId) => {
  const regs = await Registration.find({
    studentId,
    status: { $in: ['ENROLLED', 'WAITLISTED'] },
  }).populate('courseId');

  // Format to match frontend expectations (course object in course property)
  return regs.map((r) => {
    const obj = r.toObject();
    return {
      ...obj,
      course: obj.courseId,
    };
  });
};

/**
 * Drops a course registration and promotes next waitlisted student if space opens
 */
export const dropRegistration = async (registrationIdOrCourseId, studentId) => {
  let registration;
  if (mongoose.Types.ObjectId.isValid(registrationIdOrCourseId)) {
    registration = await Registration.findOne({
      _id: registrationIdOrCourseId,
      studentId,
    });
  }

  if (!registration) {
    registration = await Registration.findOne({
      courseId: registrationIdOrCourseId,
      studentId,
    });
  }

  if (!registration) {
    const error = new Error('Registration record not found.');
    error.statusCode = 404;
    throw error;
  }

  const droppedStatus = registration.status;
  const courseId = registration.courseId;

  // Remove or set DROPPED
  await Registration.findByIdAndDelete(registration._id);

  // If dropped course was ENROLLED, promote earliest WAITLISTED student
  if (droppedStatus === 'ENROLLED') {
    const nextWaitlisted = await Registration.findOne({
      courseId,
      status: 'WAITLISTED',
    }).sort({ registeredAt: 1 });

    if (nextWaitlisted) {
      nextWaitlisted.status = 'ENROLLED';
      await nextWaitlisted.save();
      console.log(`[Auto-Enroll] Promoted waitlisted student ${nextWaitlisted.studentId} to ENROLLED for course ${courseId}`);
    }
  }

  return { message: 'Course registration dropped successfully.' };
};

export default {
  registerForCourse,
  getMyRegistrations,
  dropRegistration,
};
