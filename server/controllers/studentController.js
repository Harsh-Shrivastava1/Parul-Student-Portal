const Application = require('../models/Application');
const { aggregateEntity } = require('../services/compatibility/aggregator');

// GET /api/students
const getAllStudents = async (req, res, next) => {
  try {
    const { cellId } = req.query;
    let students = [];

    if (cellId) {
      // Find students who have an application assigned to this cell
      const applications = await Application.find({ assignedCellId: cellId }).select('studentId');
      const studentIds = applications.map(app => app.studentId);
      const allStudents = await aggregateEntity('students');
      students = allStudents.filter((s) => studentIds.includes(s.studentId));
    } else {
      students = await aggregateEntity('students');
    }
    
    res.json({ success: true, data: students });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/:id  (by studentId OR enrollmentNumber)
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cellId } = req.query;

    const allStudents = await aggregateEntity('students');
    const student = allStudents.find(
      (s) => String(s.studentId) === String(id) || String(s.enrollmentNumber) === String(id) || String(s.id) === String(id)
    );
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Optional cell-based access check
    if (cellId) {
      const hasAccess = await Application.findOne({ studentId: student.studentId, assignedCellId: cellId });
      if (!hasAccess) {
        return res.status(403).json({ success: false, error: 'Not authorized to view this student' });
      }
    }

    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStudents, getStudentById };
