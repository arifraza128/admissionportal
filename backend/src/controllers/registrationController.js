import registrationService from '../services/registrationService.js';

export const register = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        status: 'REJECTED',
        reason: 'Course ID is required for registration.',
      });
    }

    const result = await registrationService.registerForCourse(studentId, courseId);

    if (result.isError) {
      return res.status(result.statusCode || 400).json({
        status: result.status,
        reason: result.reason,
      });
    }

    return res.status(result.statusCode || 201).json({
      status: result.status,
      message: result.message,
      registration: result.registration,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;
    const registrations = await registrationService.getMyRegistrations(studentId);
    return res.status(200).json(registrations);
  } catch (err) {
    next(err);
  }
};

export const dropRegistration = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;
    const result = await registrationService.dropRegistration(req.params.id, studentId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  register,
  getMyRegistrations,
  dropRegistration,
};
