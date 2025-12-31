const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String
  },
  totalQuizzes: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  weakAreas: [{
    topic: String,
    score: Number
  }],
  strongAreas: [{
    topic: String,
    score: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Performance', PerformanceSchema);

