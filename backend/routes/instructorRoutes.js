const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getInstructorProfile,
  getOwnProfile,
  searchInstructors,
  getAllInstructors,
} = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllInstructors);
router.get('/search', searchInstructors);
router.route('/profile')
  .get(protect, authorize('instructor'), getOwnProfile)
  .post(protect, authorize('instructor'), createOrUpdateProfile)
  .put(protect, authorize('instructor'), createOrUpdateProfile);
router.get('/profile/:userId', getInstructorProfile);

module.exports = router;
