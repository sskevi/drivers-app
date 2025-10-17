const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/conversation', protect, getOrCreateConversation);
router.get('/conversations', protect, getConversations);
router.get('/conversation/:conversationId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
