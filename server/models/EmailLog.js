const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[A-Za-z0-9._%+-]+@paruluniversity\.ac\.in$/i, 'Only official Parul University email addresses are allowed.'],
    },
    recipientName: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Sent', 'Failed'],
      required: true,
    },
    triggerEvent: {
      type: String,
      required: true,
      trim: true,
    },
    applicationId: {
      type: String,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
    },
    internshipId: {
      type: String,
      trim: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'emailLogs',
  }
);

module.exports = mongoose.model('EmailLog', emailLogSchema);
