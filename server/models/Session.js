// server/models/Session.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, required: true }, // 'user' 或 'ai'
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SessionSchema = new mongoose.Schema({
  title: { type: String, default: '新对话' },
  messages: [MessageSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);