const express = require('express');
const router = express.Router();
const { getAllCells, getCellById } = require('../controllers/cellController');

router.get('/', getAllCells);
router.get('/:id', getCellById);

module.exports = router;
