const express = require('express');
const router = express.Router();
const { getJobs, getAllJobsAdmin, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/auth');

// Public: only active jobs
router.get('/', getJobs);
// Admin: all jobs (active + inactive)
router.get('/admin/all', protect, adminOnly, getAllJobsAdmin);
router.get('/:id', getJobById);
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

module.exports = router;
