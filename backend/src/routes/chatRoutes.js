const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage, clearChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Todas as rotas de chat são protegidas
router.get('/history', protect, getChatHistory);
router.post('/message', protect, sendMessage);
router.delete('/history', protect, clearChatHistory);

module.exports = router;
