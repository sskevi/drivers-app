const { Message, Conversation } = require('../models/Message');

// @desc    Get or create conversation
// @route   POST /api/messages/conversation
// @access  Private
const getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    // Sort participants to ensure consistent ordering
    const participants = [req.user._id.toString(), participantId].sort();

    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 }
    }).populate('participants', 'name email profileImage role');

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email profileImage role');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email profileImage role')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
};
