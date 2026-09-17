import mongoose from 'mongoose';
import { USER_IDS } from './usersData.js';

export const COURSE_IDS = {
  CS301_DBMS: new mongoose.Types.ObjectId('65c000000000000000000001'),
  ML301_ML: new mongoose.Types.ObjectId('65c000000000000000000002'),
  CS401_ADV_ML: new mongoose.Types.ObjectId('65c000000000000000000003'),
  CS302_OS: new mongoose.Types.ObjectId('65c000000000000000000004'),
};

export const coursesSeedData = [
  // 1. Database Systems
  {
    _id: COURSE_IDS.CS301_DBMS,
    code: 'CS301',
    name: 'Database Systems',
    capacity: 40,
    facultyId: USER_IDS.FACULTY_RAHUL,
    prerequisites: [],
    schedule: {
      day: 'Monday',
      start: '10:00',
      end: '11:00',
    },
    createdAt: new Date('2026-08-01T08:00:00Z'),
    updatedAt: new Date('2026-08-01T08:00:00Z'),
  },
  // 2. Machine Learning
  {
    _id: COURSE_IDS.ML301_ML,
    code: 'ML301',
    name: 'Machine Learning',
    capacity: 40,
    facultyId: USER_IDS.FACULTY_RAHUL,
    prerequisites: [],
    schedule: {
      day: 'Monday',
      start: '10:30', // Intentionally overlaps with CS301 (10:00-11:00) for timetable conflict tests
      end: '11:30',
    },
    createdAt: new Date('2026-08-01T08:00:00Z'),
    updatedAt: new Date('2026-08-01T08:00:00Z'),
  },
  // 3. Advanced Machine Learning
  {
    _id: COURSE_IDS.CS401_ADV_ML,
    code: 'CS401',
    name: 'Advanced Machine Learning',
    capacity: 40,
    facultyId: USER_IDS.FACULTY_RAHUL,
    prerequisites: ['ML301'],
    schedule: {
      day: 'Tuesday',
      start: '11:00',
      end: '12:00',
    },
    createdAt: new Date('2026-08-01T08:00:00Z'),
    updatedAt: new Date('2026-08-01T08:00:00Z'),
  },
  // 4. Operating Systems
  {
    _id: COURSE_IDS.CS302_OS,
    code: 'CS302',
    name: 'Operating Systems',
    capacity: 40,
    facultyId: USER_IDS.FACULTY_RAHUL,
    prerequisites: [],
    schedule: {
      day: 'Monday',
      start: '12:00',
      end: '13:00',
    },
    createdAt: new Date('2026-08-01T08:00:00Z'),
    updatedAt: new Date('2026-08-01T08:00:00Z'),
  },
];

export default coursesSeedData;
