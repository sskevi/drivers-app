const Booking = require('../models/Booking');
const InstructorProfile = require('../models/InstructorProfile');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Learner only)
const createBooking = async (req, res) => {
  try {
    const {
      instructorId,
      date,
      startTime,
      endTime,
      duration,
      notes,
      pickupLocation,
    } = req.body;

    // Get instructor profile
    const instructorProfile = await InstructorProfile.findOne({ user: instructorId });

    if (!instructorProfile) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Calculate total price
    const totalPrice = instructorProfile.pricing.hourlyRate * duration;

    // Create booking
    const booking = await Booking.create({
      learner: req.user._id,
      instructor: instructorId,
      instructorProfile: instructorProfile._id,
      date,
      startTime,
      endTime,
      duration,
      totalPrice,
      notes,
      pickupLocation,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('learner', 'name email phone')
      .populate('instructor', 'name email phone')
      .populate('instructorProfile');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create payment intent for booking
// @route   POST /api/bookings/:id/payment
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user is the learner
    if (booking.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm payment for booking
// @route   PUT /api/bookings/:id/confirm-payment
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user is the learner
    if (booking.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('learner', 'name email phone')
      .populate('instructor', 'name email phone')
      .populate('instructorProfile');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const query = req.user.role === 'learner' 
      ? { learner: req.user._id }
      : { instructor: req.user._id };

    const bookings = await Booking.find(query)
      .populate('learner', 'name email phone')
      .populate('instructor', 'name email phone')
      .populate('instructorProfile')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('learner', 'name email phone')
      .populate('instructor', 'name email phone')
      .populate('instructorProfile');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user is either learner or instructor
    if (
      booking.learner.toString() !== req.user._id.toString() &&
      booking.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user is either learner or instructor
    if (
      booking.learner.toString() !== req.user._id.toString() &&
      booking.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('learner', 'name email phone')
      .populate('instructor', 'name email phone')
      .populate('instructorProfile');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user is either learner or instructor
    if (
      booking.learner.toString() !== req.user._id.toString() &&
      booking.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  createPaymentIntent,
  confirmPayment,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
