const express = require('express');
const router = express.Router();
const User = require('./user');
const Student = require('./student');
const Post = require('./post');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Initialize AWS S3 with your credentials
AWS.config.update({
  accessKeyId: 'AKIAS3VBSOLOZKLXOVEC', // Your access key ID
  secretAccessKey: 'P78hbQvRSfWNkqjJUp7tjPwkmh1eN77spj7Pi2/8', // Your secret access key
  region: 'us-east-1', // Your region
});

// Create S3 instance
const s3 = new AWS.S3();

// Set up multer storage for AWS S3 with the specified bucket
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'extralumnos', // Specify your bucket name here
    acl: 'public-read', // Set the file access permissions to public
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `images/${Date.now()}_${file.originalname}`); // Generate unique file names
    },
  }),
});

// Registration Route with Image Upload
router.post('/register', upload.fields([{ name: 'profilePic' }, { name: 'bannerPic' }]), async (req, res) => {
  const { name, college, branch, year, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered!' });
    }

    // Get image URLs from the uploaded files
    const profilePicUrl = req.files['profilePic'] ? req.files['profilePic'][0].location : null;
    const bannerPicUrl = req.files['bannerPic'] ? req.files['bannerPic'][0].location : null;

    const newUser = new User({
      name,
      college,
      branch,
      year,
      email,
      password,
      status: 'pending',  // User starts with a pending status
      profilePic: profilePicUrl,  // Store the URL of the profile pic
      bannerPic: bannerPicUrl,  // Store the URL of the banner pic
    });

    await newUser.save();
    res.json({ message: 'Registration successful! Please wait for admin approval.' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});
// Student Registration Route
router.post('/register-student', async (req, res) => {
  const { name, college, branch, year, email, password, confirmPassword } = req.body;

  if (!email.endsWith('@ggits.net')) {
    return res.status(400).json({ error: 'Invalid email id' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // Check if the email is already registered for a student
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Email is already registered as a student!' });
    }

    const newStudent = new Student({
      name,
      college,
      branch,
      year,
      email,
      password, // Store the plain-text password directly
    });

    await newStudent.save();
    res.json({ message: 'Student registration successful!' });
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({ error: 'An error occurred during student registration.' });
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

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Get email and password from the request

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the password by comparing plain text (No hashing required)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Check if status is 'approved'
        if (user.status !== 'approved') {
            return res.status(403).json({ error: 'Your account is not approved yet.' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email, branch: user.branch, year: user.year}});
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An unknown error occurred.' });
    }
});
// In authroutes.js or a separate studentRoutes.js file
router.post('/student-login', async (req, res) => {
  const { email, password } = req.body;  // Get email and password from the request

  try {
      // Find the student by email
      const student = await Student.findOne({ email });

      if (!student) {
          return res.status(404).json({ error: 'Student not found' });
      }

      // Verify the password (no hashing involved)
      if (password !== student.password) {
          return res.status(401).json({ error: 'Invalid password' });
      }

      // Successful login
      return res.status(200).json({ message: 'Login successful', student: { name: student.name, email: student.email, branch: student.branch, year: student.year}});
  } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

// Create Post
router.post('/post', async (req, res) => {
  const {name, branch,title, post, year} = req.body;

  try {
    const newPost = new Post({
      name,
      title,
      post,
      branch,
      year,
    });

    await newPost.save();
    res.json({ message: 'Post Created!' });
  } catch (error) {
    console.error('Cannot Create Post:', error);
    res.status(500).json({ error: 'An error occurred while creating post.' });
  }
});

module.exports=router;