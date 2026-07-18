const express = require('express');
const router = express.Router();
const { loginCell, loginStudent } = require('../controllers/authController');

router.post('/cell/login', loginCell);
router.post('/student/login', loginStudent);

module.exports = router;
