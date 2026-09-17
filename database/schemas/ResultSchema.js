import mongoose from 'mongoose';

/**
 * Result Schema definition for universityDB.results collection
 * Holds student academic performance, letter grades, and completed course credits for prerequisite checks.
 */
export const ResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID reference is required'],
    },
    studentName: {
      type: String,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID reference is required'],
    },
    courseCode: {
      type: String,
      uppercase: true,
      trim: true,
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
      min: [0, 'Marks cannot be negative'],
      max: [100, 'Marks cannot exceed 100'],
    },
    grade: {
      type: String,
      uppercase: true,
      trim: true,
      enum: {
        values: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', null],
        message: '{VALUE} is not a recognized letter grade',
      },
    },
    gradePoint: {
      type: Number,
      default: 4.0,
    },
    credits: {
      type: Number,
      default: 3,
    },
    semester: {
      type: String,
      default: 'Spring 2026',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['COMPLETED', 'IN_PROGRESS', 'PUBLISHED', 'DRAFT'],
        message: '{VALUE} is not a valid result status',
      },
      default: 'COMPLETED',
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
    collection: 'results',
    timestamps: true,
  }
);

// Performance Indexes
ResultSchema.index({ studentId: 1 });
ResultSchema.index({ courseId: 1 });
ResultSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
ResultSchema.index({ studentId: 1, status: 1 });

export const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);
export default Result;
