const mongoose = require('mongoose');

const cellSchema = new mongoose.Schema(
  {
    cellId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cellName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    coordinatorName: {
      type: String,
      required: true,
      trim: true,
    },
    coordinatorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[A-Za-z0-9._%+-]+@paruluniversity\.ac\.in$/i, 'Only official Parul University email addresses are allowed.'],
    },
    loginId: {
      type: String,
      required: true,
      trim: true,
    },
    loginPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'cells',
  }
);

module.exports = mongoose.model('Cell', cellSchema);
