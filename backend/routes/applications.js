const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getUserApplications,
  getAllApplications,
  updateStatus
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/apply', protect, applyForJob);
router.get('/user', protect, getUserApplications);
router.get('/all', protect, adminOnly, getAllApplications);
router.put('/status', protect, adminOnly, updateStatus);

module.exports = router;
