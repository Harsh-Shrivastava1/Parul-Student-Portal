const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');

// Initialize transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Helper to save email logs without failing the main execution
 */
const logEmail = async (logData) => {
  try {
    await EmailLog.create(logData);
  } catch (error) {
    console.error('Failed to save EmailLog:', error.message);
  }
};

/**
 * Validates the email domain
 */
const isValidParulEmail = (email) => {
  return /^[A-Za-z0-9._%+-]+@paruluniversity\.ac\.in$/i.test(email);
};

/**
 * Generates the Professional HTML Template
 */
const generateHTMLTemplate = (title, contentLines) => {
  const contentHtml = contentLines.map(line => `<p style="color: #334155; font-size: 16px; line-height: 1.5; margin-bottom: 12px;">${line}</p>`).join('');
  const timestamp = new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background-color: #dc2626; padding: 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 32px; }
        .footer { background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .strong { font-weight: 600; color: #0f172a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Parul University Internship Portal</h1>
        </div>
        <div class="content">
          <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 24px; font-size: 20px;">${title}</h2>
          ${contentHtml}
        </div>
        <div class="footer">
          <p>Generated on ${timestamp}</p>
          <p>Parul University, P.O. Limda, Ta. Waghodia, Dist. Vadodara</p>
          <p><em>This is an automated message, please do not reply.</em></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Core send mail function with logging
 */
const sendAndLogEmail = async (to, subject, htmlContent, logData) => {
  if (!isValidParulEmail(to)) {
    console.warn(`Blocked email dispatch to external domain: ${to}`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@paruluniversity.ac.in',
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    logData.status = 'Sent';
    await logEmail(logData);
  } catch (error) {
    console.error(`Email sending failed to ${to}:`, error.message);
    logData.status = 'Failed';
    logData.errorMessage = error.message;
    await logEmail(logData);
  }
};

/**
 * Email functions
 */
const sendApplicationConfirmationToStudent = async (student, application, internship) => {
  const subject = 'Application Submitted Successfully';
  const html = generateHTMLTemplate(subject, [
    `Dear <span class="strong">${student.name}</span>,`,
    'Your application has been successfully submitted.',
    `<strong>Application ID:</strong> ${application.applicationId}`,
    `<strong>Internship:</strong> ${internship.internshipTitle} at ${internship.companyDepartment}`,
    `<strong>Status:</strong> ${application.applicationStatus || 'Pending'}`,
    'You will receive future updates by email whenever your application status changes.'
  ]);
  
  await sendAndLogEmail(student.email, subject, html, {
    recipientEmail: student.email,
    recipientName: student.name,
    subject,
    body: html,
    triggerEvent: 'Application Submitted',
    applicationId: application.applicationId,
    studentId: student.studentId || student.enrollmentNumber,
    internshipId: internship.internshipId,
  });
};

const sendApplicationNotificationToCoordinator = async (coordinatorEmail, student, application, internship) => {
  const subject = 'New Internship Application Received';
  const html = generateHTMLTemplate(subject, [
    'A new internship application has been received.',
    `<strong>Student:</strong> ${student.name} (${student.enrollmentNumber})`,
    `<strong>Application ID:</strong> ${application.applicationId}`,
    `<strong>Internship:</strong> ${internship.internshipTitle}`,
    'Please log in to the Internship Cell Portal to review the application.'
  ]);

  await sendAndLogEmail(coordinatorEmail, subject, html, {
    recipientEmail: coordinatorEmail,
    recipientName: 'Cell Coordinator',
    subject,
    body: html,
    triggerEvent: 'New Application Received',
    applicationId: application.applicationId,
    studentId: student.studentId || student.enrollmentNumber,
    internshipId: internship.internshipId,
  });
};

const sendStatusUpdateEmail = async (student, application, internship, newStatus, message = '') => {
  const subject = `Application Status Update: ${newStatus}`;
  const lines = [
    `Dear <span class="strong">${student.name}</span>,`,
    'There is an update regarding your internship application.',
    `<strong>Application ID:</strong> ${application.applicationId}`,
    `<strong>Internship:</strong> ${internship.internshipTitle}`,
    `<strong>New Status:</strong> ${newStatus}`,
  ];

  if (message) {
    lines.push(`<strong>Message from Coordinator:</strong> ${message}`);
  }

  lines.push('Log in to the Student Portal for more details.');

  const html = generateHTMLTemplate(subject, lines);

  await sendAndLogEmail(student.email, subject, html, {
    recipientEmail: student.email,
    recipientName: student.name,
    subject,
    body: html,
    triggerEvent: `Status Updated to ${newStatus}`,
    applicationId: application.applicationId,
    studentId: student.studentId || student.enrollmentNumber,
    internshipId: internship.internshipId,
  });
};

const sendNotificationToInternshipCell = async (subject, lines, event, application, student, internship) => {
  const internshipCellEmail = 'internshipcell@paruluniversity.ac.in';
  const html = generateHTMLTemplate(subject, lines);

  await sendAndLogEmail(internshipCellEmail, subject, html, {
    recipientEmail: internshipCellEmail,
    recipientName: 'Internship Cell',
    subject,
    body: html,
    triggerEvent: event,
    applicationId: application?.applicationId,
    studentId: student?.studentId || student?.enrollmentNumber,
    internshipId: internship?.internshipId,
  });
};

const notifyTrainingStarted = async (student, application, internship) => {
  await sendStatusUpdateEmail(student, application, internship, 'Training Started');
  await sendNotificationToInternshipCell(
    'Training Started Notification',
    [
      `Training has officially started for student <strong>${student.name}</strong> (${student.enrollmentNumber}).`,
      `<strong>Application ID:</strong> ${application.applicationId}`,
      `<strong>Internship:</strong> ${internship.internshipTitle}`
    ],
    'Training Started',
    application, student, internship
  );
};

const notifyTrainingCompleted = async (student, application, internship) => {
  await sendStatusUpdateEmail(student, application, internship, 'Training Completed');
  await sendNotificationToInternshipCell(
    'Training Completed Notification',
    [
      `Training has been completed for student <strong>${student.name}</strong> (${student.enrollmentNumber}).`,
      `<strong>Application ID:</strong> ${application.applicationId}`,
      `<strong>Internship:</strong> ${internship.internshipTitle}`
    ],
    'Training Completed',
    application, student, internship
  );
};

const notifyFinalConfirmation = async (student, application, internship) => {
  await sendStatusUpdateEmail(student, application, internship, 'Final Confirmation');
  await sendNotificationToInternshipCell(
    'Final Confirmation Notification',
    [
      `Final confirmation has been generated for student <strong>${student.name}</strong> (${student.enrollmentNumber}).`,
      `<strong>Application ID:</strong> ${application.applicationId}`,
      `<strong>Internship:</strong> ${internship.internshipTitle}`
    ],
    'Final Confirmation',
    application, student, internship
  );
};

const notifyAttendanceEvent = async (student, application, internship, isUpdate = false) => {
  const eventName = isUpdate ? 'Attendance Updated' : 'Attendance Generated';
  const subject = `Your ${eventName}`;
  const html = generateHTMLTemplate(subject, [
    `Dear <span class="strong">${student.name}</span>,`,
    `Your internship attendance has been ${isUpdate ? 'updated' : 'generated'}.`,
    `<strong>Application ID:</strong> ${application.applicationId}`,
    `<strong>Internship:</strong> ${internship.internshipTitle}`,
    'Please log in to the Student Portal to view your attendance.'
  ]);

  await sendAndLogEmail(student.email, subject, html, {
    recipientEmail: student.email,
    recipientName: student.name,
    subject,
    body: html,
    triggerEvent: eventName,
    applicationId: application.applicationId,
    studentId: student.studentId || student.enrollmentNumber,
    internshipId: internship.internshipId,
  });
};

const notifyFeedbackSubmitted = async (student, application, internship) => {
  await sendNotificationToInternshipCell(
    'Feedback Submitted by Student',
    [
      `Student <strong>${student.name}</strong> (${student.enrollmentNumber}) has submitted feedback.`,
      `<strong>Application ID:</strong> ${application.applicationId}`,
      `<strong>Internship:</strong> ${internship.internshipTitle}`
    ],
    'Feedback Submitted',
    application, student, internship
  );
};

const notifyCertificateGenerated = async (student, application, internship) => {
  const subject = 'Certificate Generated';
  const html = generateHTMLTemplate(subject, [
    `Dear <span class="strong">${student.name}</span>,`,
    'Congratulations! Your internship certificate has been generated.',
    `<strong>Application ID:</strong> ${application.applicationId}`,
    `<strong>Internship:</strong> ${internship.internshipTitle}`,
    'Please log in to the Student Portal to download your certificate.'
  ]);

  await sendAndLogEmail(student.email, subject, html, {
    recipientEmail: student.email,
    recipientName: student.name,
    subject,
    body: html,
    triggerEvent: 'Certificate Generated',
    applicationId: application.applicationId,
    studentId: student.studentId || student.enrollmentNumber,
    internshipId: internship.internshipId,
  });
};

module.exports = {
  sendApplicationConfirmationToStudent,
  sendApplicationNotificationToCoordinator,
  sendStatusUpdateEmail,
  sendNotificationToInternshipCell,
  notifyTrainingStarted,
  notifyTrainingCompleted,
  notifyFinalConfirmation,
  notifyAttendanceEvent,
  notifyFeedbackSubmitted,
  notifyCertificateGenerated
};
