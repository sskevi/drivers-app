const express = require('express');
const router = express.Router();
const {
  createBooking,
  createPaymentIntent,
  confirmPayment,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getMyBookings)
  .post(protect, authorize('learner'), createBooking);

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, cancelBooking);

router.post('/:id/payment', protect, createPaymentIntent);
router.put('/:id/confirm-payment', protect, confirmPayment);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
