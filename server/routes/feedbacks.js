const express = require('express');
const router = express.Router();
const { getFeedbacks } = require('../controllers/feedbackController');

router.get('/', getFeedbacks);

module.exports = router;
