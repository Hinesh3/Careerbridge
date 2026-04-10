const express = require('express');
const router = express.Router();
const { getAllUsers, getStats, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/stats', protect, adminOnly, getStats);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
