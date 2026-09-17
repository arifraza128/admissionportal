import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ENROLLED', 'WAITLISTED', 'REJECTED', 'DROPPED'],
      required: true,
      index: true,
    },
    semester: {
      type: String,
      default: 'Fall 2026',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to optimize duplicate registration lookups
registrationSchema.index({ studentId: 1, courseId: 1 });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
