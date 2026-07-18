const express = require('express');
const router = express.Router();
const { getTrainings, createTraining, updateTraining } = require('../controllers/trainingController');

router.get('/', getTrainings);
router.post('/', createTraining);
router.put('/:id', updateTraining);

module.exports = router;
