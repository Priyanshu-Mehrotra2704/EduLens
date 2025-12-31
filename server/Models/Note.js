const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  originalFileName: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedByRole: {
    type: String,
    enum: ['teacher', 'admin', 'user'],
    required: true
  },
  subject: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);

