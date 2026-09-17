import { getStudentTimetable } from '../services/timetableService.js';
import courseService from '../services/courseService.js';

export const getTimetable = async (req, res, next) => {
  try {
    const role = (req.user?.role || '').toUpperCase();
    const studentId = req.user?._id || req.user?.id;

    if (role === 'STUDENT') {
      const timetable = await getStudentTimetable(studentId);
      return res.status(200).json(timetable);
    } else {
      // For Faculty and Admin, return all scheduled courses
      const courses = await courseService.getAllCourses();
      return res.status(200).json(courses);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getTimetable,
};
