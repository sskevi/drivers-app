const express = require('express');
const router = express.Router();
const {
  createReview,
  getInstructorReviews,
  addReviewResponse,
  getReviewById,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('learner'), createReview);
router.get('/instructor/:instructorId', getInstructorReviews);
router.get('/:id', getReviewById);
router.put('/:id/response', protect, authorize('instructor'), addReviewResponse);

module.exports = router;
