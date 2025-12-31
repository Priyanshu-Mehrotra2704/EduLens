const Quiz = require('../Models/Quiz');
const QuizAttempt = require('../Models/QuizAttempt');
const Performance = require('../Models/Performance');
const Note = require('../Models/Note');

// Get All Available Quizzes
const getAvailableQuizzes = async (req, res) => {
  try {
    // Get all active quizzes
    const quizzes = await Quiz.find({ isActive: true })
      .select('title description subject difficulty timeLimit questions createdAt')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Get all quiz attempts by this student
    const attempts = await QuizAttempt.find({ studentId: req.userId })
      .select('quizId')
      .lean();

    // Create a set of attempted quiz IDs for quick lookup
    const attemptedQuizIds = new Set(attempts.map(attempt => attempt.quizId.toString()));

    // Filter out quizzes that have been attempted
    const availableQuizzes = quizzes.filter(quiz => !attemptedQuizIds.has(quiz._id.toString()));

    // Remove correct answers from questions for students
    const sanitizedQuizzes = availableQuizzes.map(quiz => ({
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        questionType: q.questionType,
        _id: q._id
      }))
    }));

    res.status(200).json({
      success: true,
      quizzes: sanitizedQuizzes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Single Quiz by ID (for students)
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check if student has already attempted this quiz
    const existingAttempt = await QuizAttempt.findOne({
      quizId,
      studentId: req.userId
    });

    if (existingAttempt) {
      return res.status(403).json({
        success: false,
        attempted: true,
        message: 'You have already taken this quiz',
        attempt: {
          score: existingAttempt.score,
          totalQuestions: existingAttempt.totalQuestions,
          percentage: existingAttempt.percentage,
          completedAt: existingAttempt.completedAt
        }
      });
    }

    const quiz = await Quiz.findOne({ _id: quizId, isActive: true })
      .select('title description subject difficulty timeLimit questions createdAt')
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found or not available'
      });
    }

    // Remove correct answers from questions for students
    const sanitizedQuiz = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        questionType: q.questionType,
        _id: q._id
      }))
    };

    res.status(200).json({
      success: true,
      quiz: sanitizedQuiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Submit Quiz Attempt
const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctCount = 0;
    const answerDetails = answers.map(answer => {
      const question = quiz.questions.id(answer.questionId);
      if (!question) return null;

      const isCorrect = question.correctAnswer.toLowerCase().trim() === 
                       answer.selectedAnswer.toLowerCase().trim();
      
      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    }).filter(a => a !== null);

    const score = correctCount;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save attempt
    const attempt = new QuizAttempt({
      quizId,
      studentId: req.userId,
      answers: answerDetails,
      score,
      totalQuestions,
      percentage,
      timeTaken
    });

    await attempt.save();

    // Update performance
    await updatePerformance(req.userId, quiz.subject, score, totalQuestions);

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      attempt: {
        score,
        totalQuestions,
        percentage,
        correctCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Performance
const updatePerformance = async (studentId, subject, score, totalQuestions) => {
  try {
    let performance = await Performance.findOne({ studentId, subject });

    if (!performance) {
      performance = new Performance({
        studentId,
        subject,
        totalQuizzes: 1,
        totalScore: score,
        averageScore: (score / totalQuestions) * 100
      });
    } else {
      performance.totalQuizzes += 1;
      performance.totalScore += score;
      performance.averageScore = 
        ((performance.averageScore * (performance.totalQuizzes - 1)) + 
         ((score / totalQuestions) * 100)) / performance.totalQuizzes;
      performance.lastUpdated = Date.now();
    }

    await performance.save();
  } catch (error) {
    console.error('Error updating performance:', error);
  }
};

// Get My Performance
const getMyPerformance = async (req, res) => {
  try {
    const performances = await Performance.find({ studentId: req.userId })
      .sort({ lastUpdated: -1 });

    const attempts = await QuizAttempt.find({ studentId: req.userId })
      .populate('quizId', 'title subject')
      .sort({ completedAt: -1 })
      .limit(10);

    // Calculate subject-wise aggregated data
    const allAttempts = await QuizAttempt.find({ studentId: req.userId })
      .populate('quizId', 'subject')
      .select('percentage quizId');

    const subjectStats = {};
    allAttempts.forEach(attempt => {
      const subject = attempt.quizId?.subject || 'General';
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, count: 0, scores: [] };
      }
      subjectStats[subject].total += attempt.percentage;
      subjectStats[subject].count += 1;
      subjectStats[subject].scores.push(attempt.percentage);
    });

    // Calculate averages and other stats
    const subjectWiseData = Object.keys(subjectStats).map(subject => {
      const stats = subjectStats[subject];
      const average = stats.total / stats.count;
      const maxScore = Math.max(...stats.scores);
      const minScore = Math.min(...stats.scores);
      
      return {
        subject,
        averageScore: Math.round(average * 100) / 100,
        totalQuizzes: stats.count,
        maxScore: Math.round(maxScore * 100) / 100,
        minScore: Math.round(minScore * 100) / 100
      };
    }).sort((a, b) => b.averageScore - a.averageScore); // Sort by average score descending

    res.status(200).json({
      success: true,
      performances,
      recentAttempts: attempts,
      subjectWiseData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get My Quiz Attempts
const getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ studentId: req.userId })
      .populate('quizId', 'title subject difficulty')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      attempts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get AI Recommendations
const getAIRecommendations = async (req, res) => {
  try {
    const performances = await Performance.find({ studentId: req.userId });
    const attempts = await QuizAttempt.find({ studentId: req.userId })
      .populate('quizId', 'subject')
      .limit(20);

    // Analyze weak areas
    const weakAreas = [];
    const subjectScores = {};

    attempts.forEach(attempt => {
      const subject = attempt.quizId?.subject || 'General';
      if (!subjectScores[subject]) {
        subjectScores[subject] = { total: 0, count: 0 };
      }
      subjectScores[subject].total += attempt.percentage;
      subjectScores[subject].count += 1;
    });

    Object.keys(subjectScores).forEach(subject => {
      const avg = subjectScores[subject].total / subjectScores[subject].count;
      if (avg < 60) {
        weakAreas.push({ subject, averageScore: avg });
      }
    });

    // Get recommended quizzes
    const recommendedQuizzes = await Quiz.find({
      isActive: true,
      subject: { $in: weakAreas.map(w => w.subject) }
    })
      .limit(5)
      .select('title description subject difficulty');

    // Get recommended notes
    const recommendedNotes = await Note.find({
      subject: { $in: weakAreas.map(w => w.subject) }
    })
      .limit(5)
      .select('title subject summary');

    res.status(200).json({
      success: true,
      recommendations: {
        weakAreas,
        recommendedQuizzes,
        recommendedNotes,
        message: weakAreas.length > 0 
          ? `Focus on ${weakAreas[0].subject} to improve your performance`
          : 'Keep up the great work!'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Available Notes
const getAvailableNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .select('title content subject summary fileUrl originalFileName createdAt')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAvailableQuizzes,
  getQuizById,
  submitQuizAttempt,
  getMyPerformance,
  getMyAttempts,
  getAIRecommendations,
  getAvailableNotes
};

