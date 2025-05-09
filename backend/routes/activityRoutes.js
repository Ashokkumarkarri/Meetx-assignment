const express = require('express');
const { createActivity, getActivities, updateActivity, deleteActivity } = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (viewing activities doesn't require authentication)
router.get('/', getActivities);

// Private routes (only authenticated users can create/update/delete activities)
router.post('/', authMiddleware, createActivity);
router.put('/:id', authMiddleware, updateActivity);
router.delete('/:id', authMiddleware, deleteActivity);

module.exports = router;
