const express = require('express');
const router = express.Router();
const {
  getAvailableQuizzes,
  getQuizById,
  submitQuizAttempt,
  getMyPerformance,
  getMyAttempts,
  getAIRecommendations,
  getAvailableNotes
} = require('../Controllers/StudentController');
const { verifyToken } = require('../Controllers/AuthController');

// All student routes require authentication
router.use(verifyToken);

router.get('/quizzes', getAvailableQuizzes);
router.get('/quizzes/:quizId', getQuizById);
router.post('/quizzes/attempt', submitQuizAttempt);
router.get('/performance', getMyPerformance);
router.get('/attempts', getMyAttempts);
router.get('/recommendations', getAIRecommendations);
router.get('/notes', getAvailableNotes);

module.exports = router;

