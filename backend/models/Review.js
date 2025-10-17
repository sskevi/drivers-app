const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instructorProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InstructorProfile',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  response: {
    text: String,
    createdAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
