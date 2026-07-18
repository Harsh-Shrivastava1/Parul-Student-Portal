const Cell = require('../models/Cell');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

/**
 * Handle Cell Portal Login via .env credentials
 * @route POST /api/auth/cell/login
 */
const loginCell = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, error: 'Login ID and password are required' });
    }

    // 1. Identify which cell matches the provided loginId from .env
    // We will scan process.env for CELL_*_LOGIN_ID matching the provided loginId
    const envKeys = Object.keys(process.env);
    let matchedPrefix = null;

    for (const key of envKeys) {
      if (key.startsWith('CELL_') && key.endsWith('_LOGIN_ID')) {
        if (process.env[key] === loginId) {
          matchedPrefix = key.replace('_LOGIN_ID', '');
          break;
        }
      }
    }

    if (!matchedPrefix) {
      return res.status(401).json({ success: false, error: 'Invalid Login ID or Password' });
    }

    // 2. Validate the password
    const envPassword = process.env[`${matchedPrefix}_PASSWORD`];
    if (envPassword !== password) {
      return res.status(401).json({ success: false, error: 'Invalid Login ID or Password' });
    }

    // 3. Find the Cell in MongoDB
    let cell = await Cell.findOne({ loginId });
    
    if (!cell) {
      // Fallback for older schema format (Student Portal format)
      cell = await Cell.findOne({ officerId: `usr_coord_${loginId}` });
    }

    if (!cell) {
      return res.status(404).json({ success: false, error: 'Cell record not found in database. Contact admin.' });
    }

    // 4. Create Session Object
    const session = {
      cellId: cell.cellId || cell.id || matchedPrefix.replace('CELL_', ''),
      cellName: cell.cellName || cell.name || 'Unknown Cell',
      coordinatorName: cell.coordinatorName || cell.officerName || loginId,
      coordinatorEmail: cell.coordinatorEmail || `${loginId}@paruluniversity.ac.in`,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      session,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Cell login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
};


/**
 * Handle Student Login
 * @route POST /api/auth/student/login
 */
const loginStudent = async (req, res) => {
  try {
    const { enrollmentNumber: rawEnrollment, password: rawPassword } = req.body;

    // Trim inputs to avoid whitespace issues
    const enrollmentNumber = (rawEnrollment || '').trim();
    const password = (rawPassword || '').trim();

    if (!enrollmentNumber || !password) {
      return res.status(400).json({ success: false, error: 'Enrollment Number and password are required' });
    }

    // 1. Find the Student in MongoDB (case-insensitive trim)
    const student = await Student.findOne({ enrollmentNumber });
    
    if (!student) {
      console.warn(`[Auth] No student found for enrollment: "${enrollmentNumber}"`);
      return res.status(401).json({ success: false, error: 'Invalid Enrollment Number or Password' });
    }

    // 2. Validate the password
    if (!student.password) {
      return res.status(401).json({ success: false, error: 'Account not properly set up. Please contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid Enrollment Number or Password' });
    }

    // 3. Create Session Object
    const session = {
      id: student.studentId || student._id.toString(),
      name: student.studentName,
      enrollmentNumber: student.enrollmentNumber,
      email: student.email,
      department: student.department,
      semester: student.semester,
      contact: student.contactNumber,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      session,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
};

module.exports = {
  loginCell,
  loginStudent
};
