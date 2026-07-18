const Training = require('../models/Training');
const Application = require('../models/Application');
const emailService = require('../services/emailService');
const { aggregateEntity } = require('../services/compatibility/aggregator');

// GET /api/trainings?cellId=
const getTrainings = async (req, res, next) => {
  try {
    const { cellId } = req.query;
    const trainings = await aggregateEntity('trainings', {
      filterFn: (item) => (cellId ? String(item.assignedCellId) === String(cellId) : true),
    });
    res.json({ success: true, data: trainings });
  } catch (err) {
    next(err);
  }
};

// POST /api/trainings
const createTraining = async (req, res, next) => {
  try {
    const { applicationId, studentId, internshipId, assignedCellId, mentorName, mentorContact, startDate, endDate, duration, reportingTime, reportingLocation, objectives } = req.body;
    
    // Check if training already exists
    const existing = await Training.findOne({ applicationId });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Training already started for this application' });
    }

    const trainingId = 'TRN_' + Date.now();
    const newTraining = await Training.create({
      trainingId, applicationId, studentId, assignedCellId, internshipId,
      mentorName, mentorContact, startDate, endDate, duration,
      reportingTime, reportingLocation, objectives,
      status: 'ACTIVE'
    });

    // Update application status
    await Application.findOneAndUpdate({ applicationId }, { applicationStatus: 'TRAINING_ACTIVE' });

    res.status(201).json({ success: true, data: newTraining });
  } catch (err) {
    next(err);
  }
};

// PUT /api/trainings/:id
const updateTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, completedAt, endDate, cellId } = req.body;

    const training = await Training.findOne({ trainingId: id });
    if (!training) return res.status(404).json({ success: false, error: 'Training not found' });
    if (cellId && training.assignedCellId !== cellId) return res.status(403).json({ success: false, error: 'Unauthorized' });

    if (status) training.status = status;
    if (completedAt) training.completedAt = completedAt;
    if (endDate) training.endDate = endDate;

    await training.save();

    if (status === 'COMPLETED') {
      await Application.findOneAndUpdate({ applicationId: training.applicationId }, { applicationStatus: 'TRAINING_COMPLETED' });
    }

    res.json({ success: true, data: training });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTrainings, createTraining, updateTraining };
