import mongoose from 'mongoose';
import { USER_IDS, getStudentId } from './usersData.js';

export const applicationsSeedData = [
  // 1. Arif Raza (Approved Admission)
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000001'),
    studentId: USER_IDS.STUDENT_ARIF,
    program: 'Computer Science & Engineering',
    previousQualification: 'Higher Secondary Certificate (10+2)',
    percentage: 92.5,
    status: 'APPROVED',
    submittedAt: new Date('2026-08-01T09:00:00Z'),
    reviewedAt: new Date('2026-08-02T14:30:00Z'),
    reviewedBy: USER_IDS.OFFICER_PRIYA,
    rejectionReason: null,
  },
  // 2. Student 2 (Pending Admission)
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000002'),
    studentId: getStudentId(2),
    program: 'Information Technology',
    previousQualification: 'Higher Secondary Certificate (10+2)',
    percentage: 88.0,
    status: 'PENDING',
    submittedAt: new Date('2026-08-03T10:15:00Z'),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  },
  // 3. Student 3 (Rejected Admission)
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000003'),
    studentId: getStudentId(3),
    program: 'Data Science',
    previousQualification: 'Higher Secondary Certificate (10+2)',
    percentage: 58.5,
    status: 'REJECTED',
    submittedAt: new Date('2026-08-02T11:00:00Z'),
    reviewedAt: new Date('2026-08-04T16:00:00Z'),
    reviewedBy: USER_IDS.OFFICER_PRIYA,
    rejectionReason: 'Academic score is below the minimum program cut-off threshold (65.0%).',
  },
];

// Generate Approved Admissions for Students 4 to 45 so they have full valid dossiers
for (let i = 4; i <= 45; i++) {
  const hex = i.toString(16).padStart(4, '0');
  applicationsSeedData.push({
    _id: new mongoose.Types.ObjectId(`65b00000000000000000${hex}`),
    studentId: getStudentId(i),
    program: i % 2 === 0 ? 'Computer Science & Engineering' : 'Information Technology',
    previousQualification: 'Higher Secondary Certificate (10+2)',
    percentage: 75 + (i % 20),
    status: 'APPROVED',
    submittedAt: new Date('2026-08-01T10:00:00Z'),
    reviewedAt: new Date('2026-08-02T15:00:00Z'),
    reviewedBy: USER_IDS.OFFICER_PRIYA,
    rejectionReason: null,
  });
}

export default applicationsSeedData;
