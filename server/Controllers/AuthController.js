let crypto = require('crypto');
let User = require('../Models/User');
let jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
let bcrypt = require('bcryptjs');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET ||
'your_jwt_secret_key';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const signup = async (req, res) => {
    const { name, email, password,role } = req.body;
    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' }, success=false);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role === "A1B2C3987654321" ? 'admin' : 'user',
            verificationToken
        });
        const mailoption = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            html: `<p>Please verify your email by clicking the link below:</p>
                   <a href="http://localhost:3000/api/verify-email?token=${verificationToken}">Verify Email</a>`
        };
        const info = await transporter.sendMail(mailoption);
        console.log('Verification email sent to ' + info.response);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' },success=true);
    } catch (error) {
        res.status(500).json({ message: 'Server error' }, success=false);
    }
};
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' }, success=false);
        }
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully' }, success=true);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' }, success=false);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }, success=false);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }, success=false);
        }
        if (!user.verified) {
            return res.status(400).json({ message: 'Please verify your email to login' }, success=false);
        }
        const token = jwt.sign({ userId: user._id, role: user.role}, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token',{
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        })
        req.session.user = {
            id: user._id,
            role: user.role
        }
        res.status(200).json('Login successful', success=true);
    } catch (error) {
        res.status(500).json({ message: 'Server error' }, success=false);
    }  
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
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' }, success=false);
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' }, success=false);
    }
};
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    next();
}

const isAdmin = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied", success: false });
  }
  next();
};
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout successful", success: true });
};

module.exports = {
    signup,
    verifyEmail,
    login,
    verifyToken,
    checkVerification,
    logout,
    isLoggedIn,
    isAdmin
};

