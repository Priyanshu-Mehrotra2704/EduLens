const {login, signup, verifyEmail, checkVerification, verifyToken, logout} = require('../Controllers/AuthController');
const express = require('express');
const router = express.Router();
const {loginval, signupval} = require('../Middleware/AuthMiddleware');

router.post('/signup', signupval, signup);
router.get('/verify-email', verifyEmail);
router.post('/login', loginval, login);
router.get('/check-verification', checkVerification);
router.post('/logout', verifyToken, logout);

module.exports = router;