import mongoose from 'mongoose';

/**
 * Registration Schema definition for universityDB.registrations collection
 * Tracks active course enrollments, waitlist queues, and drop statuses.
 */
export const RegistrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID reference is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID reference is required'],
    },
    status: {
      type: String,
      required: [true, 'Registration status is required'],
      enum: {
        values: ['ENROLLED', 'WAITLISTED', 'REJECTED', 'DROPPED'],
        message: '{VALUE} is not a valid registration status',
      },
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    waitlistPosition: {
      type: Number,
      default: null,
    },
  },
  {
    collection: 'registrations',
    timestamps: true,
  }
);

// Indexes
RegistrationSchema.index({ studentId: 1 });
RegistrationSchema.index({ courseId: 1 });
RegistrationSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
RegistrationSchema.index({ courseId: 1, status: 1 });

export const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
export default Registration;
