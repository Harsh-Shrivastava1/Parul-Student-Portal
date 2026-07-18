const express = require('express');
const router = express.Router();
const {
  getAdvertisements,
  getCertificates,
  getReports,
  searchAll,
  getRecentActivity,
  getRecommendedOpportunities,
  getDashboardStats,
} = require('../controllers/compatibilityController');

router.get('/advertisements', getAdvertisements);
router.get('/certificates', getCertificates);
router.get('/reports', getReports);
router.get('/search', searchAll);
router.get('/recent-activity', getRecentActivity);
router.get('/recommended-opportunities', getRecommendedOpportunities);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;
