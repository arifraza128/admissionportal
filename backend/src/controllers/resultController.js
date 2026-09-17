import resultService from '../services/resultService.js';

export const getResults = async (req, res, next) => {
  try {
    const role = (req.user?.role || '').toUpperCase();
    const filter = {};

    if (role === 'STUDENT') {
      filter.studentId = req.user._id || req.user.id;
    } else if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }

    if (req.query.courseCode) {
      filter.courseCode = req.query.courseCode.toUpperCase();
    }

    const results = await resultService.getResults(filter);
    return res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

export const createResult = async (req, res, next) => {
  try {
    const result = await resultService.createResult(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateResult = async (req, res, next) => {
  try {
    const result = await resultService.updateResult(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  getResults,
  createResult,
  updateResult,
};
