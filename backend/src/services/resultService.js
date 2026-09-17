import Result from '../models/Result.js';

export const getResults = async (filter = {}) => {
  return await Result.find(filter).sort({ publishedAt: -1 });
};

export const createResult = async (data) => {
  // Check if result already exists for student and courseCode
  const existing = await Result.findOne({
    studentId: data.studentId,
    courseCode: data.courseCode.toUpperCase(),
  });

  if (existing) {
    Object.assign(existing, data);
    existing.publishedAt = new Date();
    return await existing.save();
  }

  const result = new Result({
    ...data,
    courseCode: data.courseCode.toUpperCase(),
    publishedAt: new Date(),
  });

  return await result.save();
};

export const updateResult = async (id, data) => {
  const result = await Result.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!result) {
    const error = new Error('Result record not found.');
    error.statusCode = 404;
    throw error;
  }
  return result;
};

export default {
  getResults,
  createResult,
  updateResult,
};
