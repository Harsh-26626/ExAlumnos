const express = require('express');
const router = express.Router();
const User = require('./user');
const crypto = require('crypto');

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

    // Register user as pending by default (no approval token needed)
    const newUser = new User({
      name,
      college,
      branch,
      year,
      email,
      password,
      status: 'pending', // User starts with a pending status
    });
    await newUser.save();

    res.json({ message: 'Registration successful! Please wait for admin approval.' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

// Fetch pending users route
router.get('/pending', async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' });
    res.json(pendingUsers); // Return the list of pending users
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'An error occurred while fetching pending users.' });
  }
});

// Admin approval route
router.put('/approve/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    // Check if the user is already approved
    if (user.status === 'approved') {
      return res.status(400).json({ error: 'User is already approved!' });
    }

    // Update user status to 'approved'
    user.status = 'approved';
    await user.save();

    res.json({ message: 'User has been approved!' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'An error occurred while approving the user.' });
  }
});

// Reject user route (optional)
router.put('/reject/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    // Check if the user is already rejected
    if (user.status === 'rejected') {
      return res.status(400).json({ error: 'User has already been rejected!' });
    }

    // Update user status to 'rejected'
    user.status = 'rejected';
    await user.save();

    res.json({ message: 'User has been rejected!' });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'An error occurred while rejecting the user.' });
  }
});

module.exports = router;
