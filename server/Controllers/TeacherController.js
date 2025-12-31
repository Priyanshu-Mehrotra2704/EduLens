const Quiz = require('../Models/Quiz');
const Note = require('../Models/Note');
const QuizAttempt = require('../Models/QuizAttempt');
const { verifyToken } = require('./AuthController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'notes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.ppt', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and PowerPoint files are allowed'));
    }
  }
});

// Create Quiz
const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, subject, difficulty, timeLimit } = req.body;
    
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and questions are required'
      });
    }

    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.userId,
      subject,
      difficulty: difficulty || 'medium',
      timeLimit: timeLimit || 30
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get All Quizzes by Teacher
const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.userId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz'
      });
    }

    Object.assign(quiz, req.body);
    quiz.updatedAt = Date.now();
    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete Quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz'
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    await QuizAttempt.deleteMany({ quizId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Upload Note File
const uploadNoteFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/notes/${req.file.filename}`;
    const originalName = req.file.originalname;

    res.status(200).json({
      success: true,
      fileUrl: fileUrl,
      originalName: originalName,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading file'
    });
  }
};

// Upload Note
const uploadNote = async (req, res) => {
  try {
    const { title, content, subject, summary, fileUrl, originalFileName } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    // Ensure userRole is set, default to 'teacher' if not
    const userRole = req.userRole || 'teacher';

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      uploadedBy: req.userId,
      uploadedByRole: userRole
    };

    // Only add optional fields if they have values
    if (subject && subject.trim()) {
      noteData.subject = subject.trim();
    }
    if (summary && summary.trim()) {
      noteData.summary = summary.trim();
    }
    if (fileUrl && fileUrl.trim()) {
      noteData.fileUrl = fileUrl.trim();
      noteData.originalFileName = originalFileName || path.basename(fileUrl);
    }

    const note = new Note(noteData);

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      note
    });
  } catch (error) {
    console.error('Error uploading note:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while uploading note'
    });
  }
};

// Get My Notes
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.userId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');

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

// Get Student Performance for Quiz
const getQuizPerformance = async (req, res) => {
  try {
    const { quizId } = req.params;

    const attempts = await QuizAttempt.find({ quizId })
      .populate('studentId', 'name email')
      .sort({ completedAt: -1 });

    const stats = {
      totalAttempts: attempts.length,
      averageScore: attempts.length > 0 
        ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length 
        : 0,
      attempts
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Total Attempts Summary for a Teacher's Quizzes
const getTotalAttemptsSummary = async (req, res) => {
  try {
    const teacherQuizzes = await Quiz.find({ createdBy: req.userId }).select('_id');
    const quizIds = teacherQuizzes.map(quiz => quiz._id);

    const totalAttempts = await QuizAttempt.countDocuments({ quizId: { $in: quizIds } });

    res.status(200).json({
      success: true,
      totalAttempts
    });
  } catch (error) {
    console.error('Error fetching total attempts summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching total attempts summary.'
    });
  }
};

module.exports = {
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
};

