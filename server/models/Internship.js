const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    internshipId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    internshipTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyDepartment: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    mentorName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'internships',
  }
);

module.exports = mongoose.model('Internship', internshipSchema);
