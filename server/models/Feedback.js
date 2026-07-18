const mongoose = require('mongoose');

// Skeleton model — will be fully implemented by the Cell portal
const feedbackSchema = new mongoose.Schema(
  {
    feedbackId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, ref: 'Student' },
    internshipId: { type: String, required: true, ref: 'Internship' },
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String, trim: true },
  },
  { timestamps: true, collection: 'feedback' }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
