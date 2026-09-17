import Registration from '../models/Registration.js';
import Course from '../models/Course.js';
import { isScheduleConflicting } from '../utils/timeUtils.js';

/**
 * Validates whether the new course's schedule conflicts with any of the student's active enrolled courses.
 * 
 * @param {string|ObjectId} studentId - Student ID
 * @param {Object} newCourse - Course document to register
 * @returns {Promise<{ conflict: boolean, reason?: string, conflictingCourse?: Object }>}
 */
export const checkTimetableConflict = async (studentId, newCourse) => {
  if (!newCourse.schedule || !newCourse.schedule.day) {
    return { conflict: false };
  }

  // Find all active ENROLLED registrations for this student
  const activeRegistrations = await Registration.find({
    studentId,
    status: 'ENROLLED',
  }).populate('courseId');

  for (const reg of activeRegistrations) {
    const existingCourse = reg.courseId;
    if (!existingCourse || !existingCourse.schedule) continue;

    // Do not compare against itself if updating
    if (existingCourse._id.toString() === newCourse._id.toString()) continue;

    const hasConflict = isScheduleConflicting(existingCourse.schedule, newCourse.schedule);
    if (hasConflict) {
      return {
        conflict: true,
        reason: `Timetable conflict with ${existingCourse.name}.`,
        conflictingCourse: existingCourse,
      };
    }
  }

  return { conflict: false };
};

/**
 * Retrieves the enrolled courses timetable for a student.
 */
export const getStudentTimetable = async (studentId) => {
  const registrations = await Registration.find({
    studentId,
    status: 'ENROLLED',
  }).populate('courseId');

  return registrations
    .map((r) => r.courseId)
    .filter(Boolean);
};

export default {
  checkTimetableConflict,
  getStudentTimetable,
};
