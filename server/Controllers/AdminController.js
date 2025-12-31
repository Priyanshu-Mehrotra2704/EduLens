const User = require('../Models/User');
const Quiz = require('../Models/Quiz');
const Note = require('../Models/Note');
const QuizAttempt = require('../Models/QuizAttempt');
const Performance = require('../Models/Performance');

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role verified date')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      users,
      totalUsers: users.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get User Statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const verifiedUsers = await User.countDocuments({ verified: true });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalAdmins,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers
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

// Get All Content
const getAllContent = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const notes = await Note.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      content: {
        quizzes,
        notes,
        totalQuizzes: quizzes.length,
        totalNotes: notes.length
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

// Get System Activity
const getSystemActivity = async (req, res) => {
  try {
    const recentAttempts = await QuizAttempt.find()
      .populate('studentId', 'name email')
      .populate('quizId', 'title')
      .sort({ completedAt: -1 })
      .limit(50);

    const recentQuizzes = await Quiz.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    const recentNotes = await Note.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      activity: {
        recentAttempts,
        recentQuizzes,
        recentNotes
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

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(userId);
    await QuizAttempt.deleteMany({ studentId: userId });
    await Performance.deleteMany({ studentId: userId });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update User Role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('name email role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete Content
const deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (type === 'quiz') {
      await Quiz.findByIdAndDelete(id);
      await QuizAttempt.deleteMany({ quizId: id });
    } else if (type === 'note') {
      await Note.findByIdAndDelete(id);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Performance Analytics
const getPerformanceAnalytics = async (req, res) => {
  try {
    const allPerformances = await Performance.find()
      .populate('studentId', 'name email');

    const subjectStats = {};
    allPerformances.forEach(perf => {
      if (!subjectStats[perf.subject]) {
        subjectStats[perf.subject] = {
          totalStudents: 0,
          totalScore: 0,
          totalQuizzes: 0
        };
      }
      subjectStats[perf.subject].totalStudents += 1;
      subjectStats[perf.subject].totalScore += perf.averageScore;
      subjectStats[perf.subject].totalQuizzes += perf.totalQuizzes;
    });

    Object.keys(subjectStats).forEach(subject => {
      subjectStats[subject].averageScore = 
        subjectStats[subject].totalScore / subjectStats[subject].totalStudents;
    });

    res.status(200).json({
      success: true,
      analytics: {
        subjectStats,
        totalPerformances: allPerformances.length
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

module.exports = {
  getAllUsers,
  getUserStats,
  getAllContent,
  getSystemActivity,
  deleteUser,
  updateUserRole,
  deleteContent,
  getPerformanceAnalytics
};

