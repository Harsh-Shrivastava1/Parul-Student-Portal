const Feedback = require('../models/Feedback');
const { aggregateEntity } = require('../services/compatibility/aggregator');

// GET /api/feedbacks?cellId=&applicationId=
const getFeedbacks = async (req, res, next) => {
  try {
    const { cellId, applicationId } = req.query;
    const feedbacks = await aggregateEntity('feedbacks', {
      filterFn: (item) => {
        if (cellId && String(item.assignedCellId) !== String(cellId)) return false;
        if (applicationId && String(item.applicationId) !== String(applicationId)) return false;
        return true;
      },
    });
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeedbacks };
