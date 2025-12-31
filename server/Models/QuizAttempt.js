const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const QuizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number // in seconds
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);

