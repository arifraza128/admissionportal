import Result from '../models/Result.js';
import Course from '../models/Course.js';

/**
 * Checks if a student has successfully completed all prerequisite courses.
 * Looks up published passing grade records in the Result model.
 * 
 * @param {string|ObjectId} studentId - Student user ID
 * @param {Object} course - Course document
 * @returns {Promise<{ satisfied: boolean, reason?: string }>}
 */
export const checkPrerequisites = async (studentId, course) => {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { satisfied: true };
  }

  // Find all passed results for this student (passing grade !== 'F')
  const completedResults = await Result.find({
    studentId,
    status: 'PUBLISHED',
    grade: { $ne: 'F' },
  });

  const completedCodes = new Set(
    completedResults.map((r) => r.courseCode.toUpperCase())
  );

  for (const prereqCodeOrName of course.prerequisites) {
    // Prerequisite might be specified as 'ML301' or 'ML301 (Machine Learning)'
    const cleanedCode = prereqCodeOrName.split(' ')[0].toUpperCase();

    if (!completedCodes.has(cleanedCode)) {
      // Look up course to get friendly display name
      const prereqCourse = await Course.findOne({ code: cleanedCode });
      const prereqName = prereqCourse ? prereqCourse.name : (prereqCodeOrName.includes('(') ? prereqCodeOrName.replace(/^.*?\((.*?)\).*$/, '$1') : prereqCodeOrName);

      return {
        satisfied: false,
        reason: `Prerequisite ${prereqName} has not been completed.`,
      };
    }
  }

  return { satisfied: true };
};

export default {
  checkPrerequisites,
};
