import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
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
      type: mongoose.Schema.Types.Mixed, // ObjectId ref User or string
      ref: 'User',
    },
    faculty: {
      type: String,
      trim: true,
      default: 'Faculty Member',
    },
    prerequisites: {
      type: [String],
      default: [], // Array of course codes e.g. ["ML301"]
    },
    credits: {
      type: Number,
      default: 3,
      min: 1,
    },
    schedule: {
      day: {
        type: String,
        required: [true, 'Schedule day is required'],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      start: {
        type: String,
        required: [true, 'Schedule start time (HH:mm) is required'],
        trim: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide start time in HH:mm format'],
      },
      end: {
        type: String,
        required: [true, 'Schedule end time (HH:mm) is required'],
        trim: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide end time in HH:mm format'],
      },
    },
    room: {
      type: String,
      trim: true,
      default: 'Hall 101',
    },
    department: {
      type: String,
      trim: true,
      default: 'Computer Science',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
