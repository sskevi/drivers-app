const mongoose = require('mongoose');

const instructorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: '',
  },
  experience: {
    type: Number, // Years of experience
    default: 0,
  },
  credentials: [{
    title: String,
    issuedBy: String,
    dateIssued: Date,
    certificateUrl: String,
  }],
  vehicleType: [{
    type: String, // e.g., 'Manual', 'Automatic', 'Motorcycle'
  }],
  languages: [{
    type: String,
  }],
  serviceArea: {
    city: String,
    state: String,
    radius: Number, // Radius in miles/km
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  pricing: {
    hourlyRate: {
      type: Number,
      required: true,
    },
    packageDeals: [{
      name: String,
      hours: Number,
      price: Number,
      description: String,
    }],
  },
  availability: [{
    dayOfWeek: {
      type: Number, // 0-6 (Sunday-Saturday)
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
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
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

instructorProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InstructorProfile', instructorProfileSchema);
