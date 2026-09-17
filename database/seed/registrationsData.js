import mongoose from 'mongoose';
import { USER_IDS, getStudentId } from './usersData.js';
import { COURSE_IDS } from './coursesData.js';

export const registrationsSeedData = [];

// 1. CS301 Registrations: 40 Enrolled students (fills capacity exactly)
// Student 1 (Arif Raza)
registrationsSeedData.push({
  _id: new mongoose.Types.ObjectId('65e000000000000000000001'),
  studentId: USER_IDS.STUDENT_ARIF,
  courseId: COURSE_IDS.CS301_DBMS,
  status: 'ENROLLED',
  waitlistPosition: null,
  registeredAt: new Date('2026-08-05T08:00:00Z'),
  updatedAt: new Date('2026-08-05T08:00:00Z'),
});

// Students 2 to 40 (Enrolled in CS301)
for (let i = 2; i <= 40; i++) {
  const hex = i.toString(16).padStart(4, '0');
  registrationsSeedData.push({
    _id: new mongoose.Types.ObjectId(`65e00000000000000000${hex}`),
    studentId: getStudentId(i),
    courseId: COURSE_IDS.CS301_DBMS,
    status: 'ENROLLED',
    waitlistPosition: null,
    registeredAt: new Date(new Date('2026-08-05T08:00:00Z').getTime() + i * 60000),
    updatedAt: new Date(new Date('2026-08-05T08:00:00Z').getTime() + i * 60000),
  });
}

// Student 41: WAITLISTED in CS301 at position 1 (Validates 41st student capacity limit)
registrationsSeedData.push({
  _id: new mongoose.Types.ObjectId('65e000000000000000000041'),
  studentId: getStudentId(41),
  courseId: COURSE_IDS.CS301_DBMS,
  status: 'WAITLISTED',
  waitlistPosition: 1,
  registeredAt: new Date('2026-08-05T09:00:00Z'),
  updatedAt: new Date('2026-08-05T09:00:00Z'),
});

// Student 42: WAITLISTED in CS301 at position 2
registrationsSeedData.push({
  _id: new mongoose.Types.ObjectId('65e000000000000000000042'),
  studentId: getStudentId(42),
  courseId: COURSE_IDS.CS301_DBMS,
  status: 'WAITLISTED',
  waitlistPosition: 2,
  registeredAt: new Date('2026-08-05T09:05:00Z'),
  updatedAt: new Date('2026-08-05T09:05:00Z'),
});

// 2. ML301 Registrations: Student 1 + Students 2-10 (For timetable collision testing vs CS301)
registrationsSeedData.push({
  _id: new mongoose.Types.ObjectId('65e000000000000000000101'),
  studentId: USER_IDS.STUDENT_ARIF,
  courseId: COURSE_IDS.ML301_ML,
  status: 'ENROLLED',
  waitlistPosition: null,
  registeredAt: new Date('2026-08-05T08:15:00Z'),
  updatedAt: new Date('2026-08-05T08:15:00Z'),
});

for (let i = 2; i <= 10; i++) {
  const hex = (i + 100).toString(16).padStart(4, '0');
  registrationsSeedData.push({
    _id: new mongoose.Types.ObjectId(`65e00000000000000000${hex}`),
    studentId: getStudentId(i),
    courseId: COURSE_IDS.ML301_ML,
    status: 'ENROLLED',
    waitlistPosition: null,
    registeredAt: new Date('2026-08-05T08:20:00Z'),
    updatedAt: new Date('2026-08-05T08:20:00Z'),
  });
}

// 3. CS302 Registrations: Student 1 + Students 5-15
registrationsSeedData.push({
  _id: new mongoose.Types.ObjectId('65e000000000000000000201'),
  studentId: USER_IDS.STUDENT_ARIF,
  courseId: COURSE_IDS.CS302_OS,
  status: 'ENROLLED',
  waitlistPosition: null,
  registeredAt: new Date('2026-08-05T08:30:00Z'),
  updatedAt: new Date('2026-08-05T08:30:00Z'),
});

for (let i = 5; i <= 15; i++) {
  const hex = (i + 200).toString(16).padStart(4, '0');
  registrationsSeedData.push({
    _id: new mongoose.Types.ObjectId(`65e00000000000000000${hex}`),
    studentId: getStudentId(i),
    courseId: COURSE_IDS.CS302_OS,
    status: 'ENROLLED',
    waitlistPosition: null,
    registeredAt: new Date('2026-08-05T08:35:00Z'),
    updatedAt: new Date('2026-08-05T08:35:00Z'),
  });
}

// 4. Edge Cases: DROPPED and REJECTED registrations
registrationsSeedData.push({
  _id: new mongoose.Types.ObjectId('65e000000000000000000301'),
  studentId: getStudentId(43),
  courseId: COURSE_IDS.CS302_OS,
  status: 'DROPPED',
  waitlistPosition: null,
  registeredAt: new Date('2026-08-05T08:40:00Z'),
  updatedAt: new Date('2026-08-06T10:00:00Z'),
});

registrationsSeedData.push({
  _id: new mongoose.Types.ObjectId('65e000000000000000000302'),
  studentId: getStudentId(44),
  courseId: COURSE_IDS.CS401_ADV_ML,
  status: 'REJECTED',
  waitlistPosition: null,
  registeredAt: new Date('2026-08-05T08:45:00Z'),
  updatedAt: new Date('2026-08-05T08:45:00Z'),
});

export default registrationsSeedData;
