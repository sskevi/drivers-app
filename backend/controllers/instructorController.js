const InstructorProfile = require('../models/InstructorProfile');
const User = require('../models/User');

// @desc    Create or update instructor profile
// @route   POST/PUT /api/instructors/profile
// @access  Private (Instructor only)
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      bio,
      experience,
      credentials,
      vehicleType,
      languages,
      serviceArea,
      pricing,
      availability,
    } = req.body;

    let profile = await InstructorProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile.bio = bio !== undefined ? bio : profile.bio;
      profile.experience = experience !== undefined ? experience : profile.experience;
      profile.credentials = credentials || profile.credentials;
      profile.vehicleType = vehicleType || profile.vehicleType;
      profile.languages = languages || profile.languages;
      profile.serviceArea = serviceArea || profile.serviceArea;
      profile.pricing = pricing || profile.pricing;
      profile.availability = availability || profile.availability;

      await profile.save();
    } else {
      // Create new profile
      profile = await InstructorProfile.create({
        user: req.user._id,
        bio,
        experience,
        credentials,
        vehicleType,
        languages,
        serviceArea,
        pricing,
        availability,
      });
    }

    const populatedProfile = await InstructorProfile.findById(profile._id).populate('user', 'name email phone profileImage');
    res.json(populatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor profile by user ID
// @route   GET /api/instructors/profile/:userId
// @access  Public
const getInstructorProfile = async (req, res) => {
  try {
    const profile = await InstructorProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email phone profileImage');

    if (!profile) {
      return res.status(404).json({ message: 'Instructor profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get own instructor profile
// @route   GET /api/instructors/profile
// @access  Private (Instructor only)
const getOwnProfile = async (req, res) => {
  try {
    const profile = await InstructorProfile.findOne({ user: req.user._id })
      .populate('user', 'name email phone profileImage');

    if (!profile) {
      return res.status(404).json({ message: 'Instructor profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search and filter instructors
// @route   GET /api/instructors/search
// @access  Public
const searchInstructors = async (req, res) => {
  try {
    const {
      city,
      state,
      vehicleType,
      minRating,
      maxPrice,
      language,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (city) {
      query['serviceArea.city'] = new RegExp(city, 'i');
    }

    if (state) {
      query['serviceArea.state'] = new RegExp(state, 'i');
    }

    if (vehicleType) {
      query.vehicleType = { $in: [vehicleType] };
    }

    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      query['pricing.hourlyRate'] = { $lte: parseFloat(maxPrice) };
    }

    if (language) {
      query.languages = { $in: [language] };
    }

    const skip = (page - 1) * limit;

    const instructors = await InstructorProfile.find(query)
      .populate('user', 'name email phone profileImage')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ 'rating.average': -1 });

    const total = await InstructorProfile.countDocuments(query);

    res.json({
      instructors,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active instructors
// @route   GET /api/instructors
// @access  Public
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await InstructorProfile.find({ isActive: true })
      .populate('user', 'name email phone profileImage')
      .sort({ 'rating.average': -1 });

    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateProfile,
  getInstructorProfile,
  getOwnProfile,
  searchInstructors,
  getAllInstructors,
};
