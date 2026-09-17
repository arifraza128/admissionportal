import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    courseName: {
      type: String,
      trim: true,
    },
    faculty: {
      type: String,
      trim: true,
    },
    marks: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    grade: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    gradePoint: {
      type: Number,
      default: 4.0,
    },
    semester: {
      type: String,
      default: 'Spring 2026',
    },
    credits: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: ['PUBLISHED', 'DRAFT'],
      default: 'PUBLISHED',
      index: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
