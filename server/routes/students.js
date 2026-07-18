const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById } = require('../controllers/studentController');

router.get('/', getAllStudents);
router.get('/:id', getStudentById);

module.exports = router;
