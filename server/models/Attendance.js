const mongoose = require('mongoose');

// Skeleton model — will be fully implemented by the Cell portal
const attendanceSchema = new mongoose.Schema(
  {
    attendanceId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, ref: 'Student' },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
  },
  { timestamps: true, collection: 'attendance' }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
