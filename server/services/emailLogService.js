const EmailLog = require('../models/EmailLog');

/**
 * Saves an email log to MongoDB.
 */
const saveEmailLog = async ({ to, subject, body, applicationId }) => {
  try {
    await EmailLog.create({
      to,
      subject,
      body,
      applicationId: applicationId || null,
      timestamp: new Date(),
    });
  } catch (err) {
    console.warn('Failed to save email log:', err.message);
  }
};

module.exports = { saveEmailLog };
