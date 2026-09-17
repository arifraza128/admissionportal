import mongoose from 'mongoose';
import { USER_IDS, getStudentId } from './usersData.js';
import { COURSE_IDS } from './coursesData.js';

export const resultsSeedData = [
  // 1. Arif Raza: Has completed ML301 with Grade A+ -> Satisfies CS401 prerequisite
  {
    _id: new mongoose.Types.ObjectId('65f000000000000000000001'),
    studentId: USER_IDS.STUDENT_ARIF,
    studentName: 'Arif Raza',
    courseId: COURSE_IDS.ML301_ML,
    courseCode: 'ML301',
    courseName: 'Machine Learning',
    faculty: 'Dr. Rahul Sharma',
    grade: 'A+',
    gradePoint: 4.0,
    credits: 3,
    marks: 95,
    semester: 'Spring 2026',
    status: 'COMPLETED',
    remarks: 'Outstanding performance in advanced neural networks and deep learning.',
    publishedAt: new Date('2026-07-20T10:00:00Z'),
    createdAt: new Date('2026-07-20T10:00:00Z'),
    updatedAt: new Date('2026-07-20T10:00:00Z'),
  },
  // 2. Arif Raza: CS302 In-Progress
  {
    _id: new mongoose.Types.ObjectId('65f000000000000000000002'),
    studentId: USER_IDS.STUDENT_ARIF,
    studentName: 'Arif Raza',
    courseId: COURSE_IDS.CS302_OS,
    courseCode: 'CS302',
    courseName: 'Operating Systems',
    faculty: 'Dr. Rahul Sharma',
    grade: null,
    gradePoint: null,
    credits: 3,
    marks: null,
    semester: 'Fall 2026',
    status: 'IN_PROGRESS',
    remarks: 'Currently enrolled for Fall 2026 semester.',
    publishedAt: null,
    createdAt: new Date('2026-08-05T08:30:00Z'),
    updatedAt: new Date('2026-08-05T08:30:00Z'),
  },
];

// 3. Students 2 to 10: Completed ML301
const grades = ['A', 'A+', 'B+', 'A', 'B', 'A+', 'A', 'B+', 'A'];
const marks = [88, 92, 79, 85, 74, 96, 89, 78, 87];
const gradePoints = [4.0, 4.0, 3.5, 4.0, 3.0, 4.0, 4.0, 3.5, 4.0];

for (let i = 2; i <= 10; i++) {
  const hex = (i + 10).toString(16).padStart(4, '0');
  resultsSeedData.push({
    _id: new mongoose.Types.ObjectId(`65f00000000000000000${hex}`),
    studentId: getStudentId(i),
    studentName: `Student ${i}`,
    courseId: COURSE_IDS.ML301_ML,
    courseCode: 'ML301',
    courseName: 'Machine Learning',
    faculty: 'Dr. Rahul Sharma',
    grade: grades[i - 2],
    gradePoint: gradePoints[i - 2],
    credits: 3,
    marks: marks[i - 2],
    semester: 'Spring 2026',
    status: 'COMPLETED',
    remarks: 'Course completed successfully.',
    publishedAt: new Date('2026-07-20T10:00:00Z'),
    createdAt: new Date('2026-07-20T10:00:00Z'),
    updatedAt: new Date('2026-07-20T10:00:00Z'),
  });
}

export default resultsSeedData;
