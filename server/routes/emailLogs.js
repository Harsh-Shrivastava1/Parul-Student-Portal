const express = require('express');
const router = express.Router();
const EmailLog = require('../models/EmailLog');

// POST /api/email-logs — save email log from frontend
router.post('/', async (req, res, next) => {
  try {
    const { to, subject, body, applicationId, timestamp } = req.body;
    const log = await EmailLog.create({
      to,
      subject,
      body,
      applicationId: applicationId || null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
