const Cell = require('../models/Cell');

// GET /api/cells
const getAllCells = async (req, res, next) => {
  try {
    const cells = await Cell.find().sort({ cellId: 1 });
    res.json({ success: true, data: cells });
  } catch (err) {
    next(err);
  }
};

// GET /api/cells/:id
const getCellById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cell = await Cell.findOne({ cellId: id });
    if (!cell) {
      return res.status(404).json({ success: false, error: 'Cell not found' });
    }
    res.json({ success: true, data: cell });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCells, getCellById };
