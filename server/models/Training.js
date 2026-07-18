const mongoose = require('mongoose');

// Skeleton model — will be fully implemented by the Training/Cell portal
const trainingSchema = new mongoose.Schema(
  {
    trainingId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, ref: 'Student' },
    internshipId: { type: String, required: true, ref: 'Internship' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['Scheduled', 'Ongoing', 'Completed'], default: 'Scheduled' },
  },
  { timestamps: true, collection: 'trainings' }
);

module.exports = mongoose.model('Training', trainingSchema);
