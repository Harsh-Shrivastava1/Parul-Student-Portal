const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[A-Za-z0-9._%+-]+@paruluniversity\.ac\.in$/i, 'Only official Parul University email addresses are allowed.'],
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    cgpa: { type: Number },
    spi: { type: Number },
    gender: { type: String, trim: true },
    dateOfBirth: { type: String, trim: true },
    category: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    presentAddress: { type: String, trim: true },
    permanentAddress: { type: String, trim: true },
    institute: { type: String, trim: true },
    skills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    avatarUrl: { type: String, trim: true },
    password: { type: String },
  },
  {
    timestamps: true,
    collection: 'students',
  }
);

module.exports = mongoose.model('Student', studentSchema);
