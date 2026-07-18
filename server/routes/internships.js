const express = require('express');
const router = express.Router();
const { getAllInternships, getInternshipById, getDebugCounts } = require('../controllers/internshipController');

router.get('/', getAllInternships);
router.get('/debug/counts', getDebugCounts);
router.get('/:id', getInternshipById);

module.exports = router;
