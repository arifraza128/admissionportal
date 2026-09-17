import mongoose from 'mongoose';

/**
 * Schedule Sub-Schema for Course lecture timings
 */
const ScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: [true, 'Schedule day is required'],
      enum: {
        values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        message: '{VALUE} is not a valid weekday',
      },
    },
    start: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in 24-hour HH:mm format (e.g. 10:00)'],
    },
    end: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in 24-hour HH:mm format (e.g. 11:00)'],
    },
  },
  { _id: false }
);

/**
 * Course Schema definition for universityDB.courses collection
 * Represents official university curriculum subjects, capacities, and scheduling slots.
 */
export const CourseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Course capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    schedule: {
      type: ScheduleSchema,
      required: [true, 'Course schedule is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'courses',
    timestamps: true,
  }
);

// Indexes
CourseSchema.index({ code: 1 }, { unique: true });
CourseSchema.index({ name: 1 });
CourseSchema.index({ facultyId: 1 });
CourseSchema.index({ 'schedule.day': 1, 'schedule.start': 1 });

export const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;
