const crypto = require('crypto');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const ADMIN_SECRET = "A1B2C3987654321";
const TEACHER_SECRET = "TEACHER2024";

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  const { name, email, password, adminCode, teacherCode, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Determine role based on codes or explicit role (all optional)
    let finalRole = 'user'; // Default role
    
    // Check if admin code is provided and matches
    if (adminCode && adminCode.trim() === ADMIN_SECRET) {
      finalRole = 'admin';
    }
    // Check if teacher code is provided and matches (only if not admin)
    else if (teacherCode && teacherCode.trim() === TEACHER_SECRET) {
      finalRole = 'teacher';
    }
    // If explicit role is provided in request, use it (for admin override)
    else if (role === 'admin' || role === 'teacher') {
      finalRole = role;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      verificationToken,
      verified: false
    });

    await newUser.save();

    // Use frontend URL for email verification link
    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification - EduLens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #207dff;">Welcome to EduLens!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with EduLens. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #207dff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't create an account with EduLens, please ignore this email.
          </p>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/* ================= VERIFY EMAIL ================= */
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Verification token is required'
    });
  }

  try {
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Check if already verified
    if (user.verified) {
      return res.status(200).json({
        success: true,
        message: 'Email is already verified'
      });
    }

    // Verify the user
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      email: user.email
    });

  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying email'
    });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ FIXED COOKIE
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000
    });

    if (req.session) {
      req.session.user = {
        id: user._id,
        role: user.role
      };
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      role: user.role,
      name: user.name
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/* ================= MIDDLEWARE ================= */
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

const isAdminOrTeacher = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Teacher or Admin role required.'
    });
  }
  next();
};

const logout = (req, res) => {
  res.clearCookie('token');
  if (req.session) req.session.destroy(() => {});
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};
const checkVerification = async (req, res) => {
    try{
    const {email} = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    if (user.verified) {
      return res.status(200).json({ message: 'Email is already verified', success: true, verified: true });
    }else{
      return res.status(200).json({ message: 'Email is not verified', success: false, verified: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error checking email verification', success: false });
  }
};
module.exports = {
  signup,
  verifyEmail,
  login,
  verifyToken,
  checkVerification,
  logout,
  isLoggedIn,
  isAdmin,
  isAdminOrTeacher
};
