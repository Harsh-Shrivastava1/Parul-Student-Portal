const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  createApplication,
  deleteApplication,
  updateApplicationStatus,
} = require('../controllers/applicationController');

router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.delete('/:id', deleteApplication);
router.put('/:id/status', updateApplicationStatus);

module.exports = router;
