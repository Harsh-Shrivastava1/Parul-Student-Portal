const Attendance = require('../models/Attendance');
const Training = require('../models/Training');
const { aggregateEntity } = require('../services/compatibility/aggregator');

// GET /api/attendance?trainingId=&studentId=&cellId=
const getAttendance = async (req, res, next) => {
  try {
    const { trainingId, studentId, cellId } = req.query;
    const records = await aggregateEntity('attendance', {
      filterFn: (item) => {
        if (trainingId && String(item.trainingId) !== String(trainingId)) return false;
        if (studentId && String(item.studentId) !== String(studentId)) return false;
        if (cellId && String(item.assignedCellId) !== String(cellId)) return false;
        return true;
      },
    });
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

// POST /api/attendance
const markAttendance = async (req, res, next) => {
  try {
    const { trainingId, studentId, assignedCellId, date, status, remarks } = req.body;
    
    let record = await Attendance.findOne({ trainingId, date, studentId });
    if (record) {
      record.status = status;
      if (remarks) record.remarks = remarks;
      await record.save();
    } else {
      const attendanceId = 'ATT_' + Date.now() + Math.floor(Math.random()*1000);
      record = await Attendance.create({ attendanceId, trainingId, studentId, assignedCellId, date, status, remarks });
    }
    
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAttendance, markAttendance };
