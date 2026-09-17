import mongoose from 'mongoose';

/**
 * Application Schema definition for universityDB.applications collection
 * Tracks student admission dossiers, previous qualifications, and evaluation decisions.
 */
export const ApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID reference is required'],
    },
    applicantName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    program: {
      type: String,
      required: [true, 'Academic program is required'],
      trim: true,
    },
    term: {
      type: String,
      default: 'Fall 2026',
    },
    previousQualification: {
      type: String,
      trim: true,
    },
    percentage: {
      type: Number,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid admission status',
      },
      default: 'PENDING',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewDate: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.Mixed, // ObjectId or reviewer name string
      ref: 'User',
    },
    reviewerNotes: {
      type: String,
      trim: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'applications',
    timestamps: true,
  }
);

// Performance Indexes
ApplicationSchema.index({ studentId: 1 });
ApplicationSchema.index({ status: 1, submittedAt: -1 });

export const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
export default Application;
