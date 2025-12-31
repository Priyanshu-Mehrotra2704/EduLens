const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getMyQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  uploadNote,
  uploadNoteFile,
  getMyNotes,
  getQuizPerformance,
  getTotalAttemptsSummary,
  upload
} = require('../Controllers/TeacherController');
const { verifyToken, isAdminOrTeacher } = require('../Controllers/AuthController');

// All teacher routes require authentication and teacher role
router.use(verifyToken);
router.use(isAdminOrTeacher);

// Quiz routes
router.post('/quizzes', createQuiz);
router.get('/quizzes', getMyQuizzes);
router.get('/quizzes/:id', getQuizById);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);
router.get('/quizzes/:quizId/performance', getQuizPerformance);
router.get('/quizzes/attempts-summary', getTotalAttemptsSummary);

// Note routes
router.post('/notes/upload-file', upload.single('file'), uploadNoteFile);
router.post('/notes', uploadNote);
router.get('/notes', getMyNotes);

module.exports = router;

