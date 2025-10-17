const Review = require('../models/Review');
const Booking = require('../models/Booking');
const InstructorProfile = require('../models/InstructorProfile');

// @desc    Create a review for a completed booking
// @route   POST /api/reviews
// @access  Private (Learner only)
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Verify user is the learner
    if (booking.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if review already exists
    const reviewExists = await Review.findOne({ booking: bookingId });

    if (reviewExists) {
      return res.status(400).json({ message: 'Review already submitted for this booking' });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      learner: req.user._id,
      instructor: booking.instructor,
      instructorProfile: booking.instructorProfile,
      rating,
      comment,
    });

    // Update instructor rating
    const instructorProfile = await InstructorProfile.findById(booking.instructorProfile);
    const reviews = await Review.find({ instructorProfile: booking.instructorProfile });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    instructorProfile.rating.average = totalRating / reviews.length;
    instructorProfile.rating.count = reviews.length;
    
    await instructorProfile.save();

    const populatedReview = await Review.findById(review._id)
      .populate('learner', 'name profileImage')
      .populate('instructor', 'name')
      .populate('booking');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for an instructor
// @route   GET /api/reviews/instructor/:instructorId
// @access  Public
const getInstructorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ instructor: req.params.instructorId })
      .populate('learner', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add response to a review
// @route   PUT /api/reviews/:id/response
// @access  Private (Instructor only)
const addReviewResponse = async (req, res) => {
  try {
    const { text } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Verify user is the instructor
    if (review.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.response = {
      text,
      createdAt: new Date(),
    };

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('learner', 'name profileImage')
      .populate('instructor', 'name');

    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('learner', 'name profileImage')
      .populate('instructor', 'name')
      .populate('booking');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getInstructorReviews,
  addReviewResponse,
  getReviewById,
};
