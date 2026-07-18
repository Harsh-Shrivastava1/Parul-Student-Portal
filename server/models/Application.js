const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Under Review', 'Shortlisted', 'Round 1 Completed', 'Rejected', 'Training', 'Completed'],
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    internshipId: {
      type: String,
      required: true,
      ref: 'Internship',
    },
    // Denormalized snapshot so display works even if internship is edited
    internshipSnapshot: {
      internshipTitle: { type: String, required: true },
      companyDepartment: { type: String, required: true },
    },
    // The enrollment number of the applying student (used as userId in the portal)
    userId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      ref: 'Student',
    },
    appliedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    applicationStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Under Review', 'Shortlisted', 'Round 1 Completed', 'Rejected', 'Training', 'Completed'],
      default: 'Pending',
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timeline: {
      type: [timelineEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'applications',
  }
);

// userId is non-unique, keep explicit index for query performance
applicationSchema.index({ userId: 1 });

module.exports = mongoose.model('Application', applicationSchema);
