import Course from '../models/Course.js';
import Registration from '../models/Registration.js';

export const getAllCourses = async (filter = {}) => {
  const courses = await Course.find(filter).sort({ code: 1 });

  // Compute live enrolledCount and availableSeats for each course
  const coursesWithSeats = await Promise.all(
    courses.map(async (course) => {
      const enrolledCount = await Registration.countDocuments({
        courseId: course._id,
        status: 'ENROLLED',
      });
      const availableSeats = Math.max(0, course.capacity - enrolledCount);
      const courseObj = course.toObject();
      return {
        ...courseObj,
        enrolledCount,
        availableSeats,
        registrationStatus: availableSeats > 0 ? 'OPEN' : 'FULL',
      };
    })
  );

  return coursesWithSeats;
};

export const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }

  const enrolledCount = await Registration.countDocuments({
    courseId: course._id,
    status: 'ENROLLED',
  });
  const availableSeats = Math.max(0, course.capacity - enrolledCount);

  const courseObj = course.toObject();
  return {
    ...courseObj,
    enrolledCount,
    availableSeats,
    registrationStatus: availableSeats > 0 ? 'OPEN' : 'FULL',
  };
};

export const createCourse = async (data) => {
  const course = new Course(data);
  return await course.save();
};

export const updateCourse = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }
  return course;
};

export const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }
  return { message: 'Course deleted successfully' };
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
