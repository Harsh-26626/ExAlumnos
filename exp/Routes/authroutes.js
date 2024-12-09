const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Send approval email with the approval link
const sendApprovalEmail = (userEmail, userName, approvalToken) => {
  const approvalLink = `http://localhost:3000/api/approve/${approvalToken}`;

  const mailOptions = {
    from: 'vinay2006.vkc@gmail.com',
    to: userEmail,
    subject: 'Please Approve the User',
    text: `Hello Admin,\n\nA new user has registered. Click the following link to approve the user:\n\n${approvalLink}\n\nBest regards,\nAdmin`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Approval email sent:', info.response);
    }
  });
};

// Registration route
router.post('/register', async (req, res) => {
  const { name, college, branch, year, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered!' });
    }

    const registrationToken = crypto.randomBytes(32).toString('hex'); // Generate a unique token

    const newUser = new User({ 
      name, 
      college, 
      branch, 
      year, 
      email, 
      password, 
      status: 'pending',
      approvalToken: registrationToken, // Store the token
    });
    await newUser.save();

    // Send the approval email with the token
    sendApprovalEmail(newUser.email, newUser.name, registrationToken);
    
    res.json({ message: 'Registration successful! Please wait for admin approval.' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

// Admin approval route
router.get('/approve/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user by the approval token
    const user = await User.findOne({ approvalToken: token });

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired approval token!' });
    }

    // Update user status to 'approved'
    user.status = 'approved';
    user.approvalToken = undefined;  // Clear the approval token after approval
    await user.save();

    res.json({ message: 'User has been approved!' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'An error occurred while approving the user.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found!' });
    }

    if (user.status === 'pending') {
      return res.status(400).json({ error: 'Your account is still pending approval!' });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials!' });
    }

    res.json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

module.exports = router;
