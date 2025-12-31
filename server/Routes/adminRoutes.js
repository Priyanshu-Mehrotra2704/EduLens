const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserStats,
  getAllContent,
  getSystemActivity,
  deleteUser,
  updateUserRole,
  deleteContent,
  getPerformanceAnalytics
} = require('../Controllers/AdminController');
const { verifyToken } = require('../Controllers/AuthController');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use((req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
});

router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.get('/content', getAllContent);
router.get('/activity', getSystemActivity);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/role', updateUserRole);
router.delete('/content/:type/:id', deleteContent);
router.get('/analytics', getPerformanceAnalytics);

module.exports = router;

