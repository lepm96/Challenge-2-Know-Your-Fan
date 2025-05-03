const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interactionType: {
    type: String,
    enum: ['like', 'comment', 'share'],
    required: true
  },
  content: {
    type: String
  },
  platform: {
    type: String,
    enum: ['instagram', 'twitter', 'facebook'],
    required: true
  },
  interactionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserInteraction', userInteractionSchema);
