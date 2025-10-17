const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // HH:MM format
    required: true,
  },
  endTime: {
    type: String, // HH:MM format
    required: true,
  },
  duration: {
    type: Number, // Hours
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentIntentId: {
    type: String, // Stripe payment intent ID
  },
  notes: {
    type: String,
    default: '',
  },
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
