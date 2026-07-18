const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Cell = require('../models/Cell');
const Student = require('../models/Student');
const emailService = require('../services/emailService');
const internshipService = require('../services/internshipService');
const { aggregateEntity, aggregateSingleById } = require('../services/compatibility/aggregator');
const { generateId } = require('../utils/idGenerator');

// GET /api/applications?userId=&cellId=
const getApplications = async (req, res, next) => {
  try {
    const { userId, cellId } = req.query;
    const applications = await aggregateEntity('applications', {
      filterFn: (app) => {
        if (userId && String(app.userId) !== String(userId) && String(app.studentId) !== String(userId)) return false;
        if (cellId && String(app.assignedCellId) !== String(cellId)) return false;
        return true;
      },
    });
    res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/:id
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await aggregateSingleById('applications', id, ['applicationId', 'id', '_id']);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

// POST /api/applications
const createApplication = async (req, res, next) => {
  try {
    const { internshipId, userId, studentId, formData } = req.body;

    if (!internshipId || !userId) {
      return res.status(400).json({ success: false, error: 'internshipId and userId are required' });
    }

    if (formData && formData.email) {
      if (!/^[A-Za-z0-9._%+-]+@paruluniversity\.ac\.in$/i.test(formData.email)) {
        return res.status(400).json({ success: false, message: 'Only official Parul University email addresses are allowed.' });
      }
    }

    // Check if internship exists
    const internship = await internshipService.getInternshipById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    // Check for duplicate application
    const existingApps = await aggregateEntity('applications', {
      filterFn: (app) => String(app.internshipId) === String(internshipId) && String(app.userId) === String(userId),
    });
    const existing = existingApps[0];
    if (existing) {
      return res.status(409).json({ success: false, error: 'You have already applied for this internship' });
    }

    // Resolve studentId from Student collection if not provided
    let resolvedStudentId = studentId;
    if (!resolvedStudentId && userId) {
      const student = await Student.findOne({ enrollmentNumber: userId });
      if (student) {
        resolvedStudentId = student.studentId;
      }
    }

    const applicationId = await generateId(Application, 'APP');
    const now = new Date();

    const newApplication = await Application.create({
      applicationId,
      internshipId,
      internshipSnapshot: {
        internshipTitle: internship.internshipTitle,
        companyDepartment: internship.companyDepartment,
      },
      userId,
      studentId: resolvedStudentId || null,
      appliedDate: now,
      applicationStatus: 'Pending',
      formData: formData || {},
      timeline: [
        {
          status: 'Pending',
          timestamp: now,
          notes: `Application submitted successfully. Your application ID is ${applicationId}.`,
        },
      ],
    });

    // Auto-create a notification for this user
    await Notification.create({
      userId,
      title: '✅ Application Submitted',
      message: `Your application for "${internship.internshipTitle}" at ${internship.companyDepartment} has been submitted. Application ID: ${applicationId}.`,
      date: now,
      read: false,
      type: 'success',
      link: `/applications/${applicationId}/status`,
    });

    res.status(201).json({ success: true, data: newApplication });

    // --- NON-BLOCKING EMAIL TRIGGER ---
    // Execute email sending in the background without awaiting it to avoid failing/delaying the main API response
    (async () => {
      try {
        const mongoose = require('mongoose');
        const studentQuery = [{ studentId: studentId }, { enrollmentNumber: userId }];
        if (mongoose.isValidObjectId(userId)) {
          studentQuery.push({ _id: userId });
        }
        const student = await Student.findOne({ $or: studentQuery });
        const cell = await Cell.findOne({
          $or: [
            { department: internship.companyDepartment },
            { cellName: internship.companyDepartment },
            { cellId: internship.cellId } // fallback
          ]
        });

        if (student) {
          await emailService.sendApplicationConfirmationToStudent(student, newApplication, internship);
        }
        if (student && cell && cell.coordinatorEmail) {
          await emailService.sendApplicationNotificationToCoordinator(cell.coordinatorEmail, student, newApplication, internship);
        }
      } catch (emailTriggerError) {
        console.error('Error in background email trigger:', emailTriggerError.message);
      }
    })();
    // ----------------------------------

  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id  (withdraw)
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findOneAndDelete({ applicationId: id });
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, cellId } = req.body;

    const application = await Application.findOne({ applicationId: id });
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (cellId && application.assignedCellId !== cellId) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this application' });
    }

    application.applicationStatus = status;
    application.timeline.push({
      status,
      timestamp: new Date(),
      notes: notes || `Status updated to ${status}`
    });

    await application.save();

    res.json({ success: true, data: application });

    // --- TRIGGER EMAILS ---
    (async () => {
      try {
        const student = await Student.findOne({ studentId: application.studentId });
        const internship = await internshipService.getInternshipById(application.internshipId);

        if (student && internship) {
          if (status === 'Pending') {
            // Under Review actually
          } else if (status === 'Under Review' || status === 'Shortlisted') {
            await emailService.sendStatusUpdateEmail(student, application, internship, status, notes);
          } else if (status === 'Changes Requested') {
            await emailService.sendStatusUpdateEmail(student, application, internship, 'Changes Requested', notes);
          } else if (status === 'Approved' || status === 'Selected') {
            await emailService.sendStatusUpdateEmail(student, application, internship, 'Approved', 'Congratulations! Your application has been approved.');
            await emailService.sendNotificationToInternshipCell('Application Approved',
              ['An application has been approved by the cell coordinator.', `Application ID: ${application.applicationId}`],
              'Application Approved', application, student, internship);
          } else if (status === 'Rejected') {
            await emailService.sendStatusUpdateEmail(student, application, internship, 'Rejected', notes);
          }
        }
      } catch (err) {
        console.error('Email trigger error in updateApplicationStatus:', err);
      }
    })();

  } catch (err) {
    next(err);
  }
};

module.exports = { getApplications, getApplicationById, createApplication, deleteApplication, updateApplicationStatus };
