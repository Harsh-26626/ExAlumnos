const express = require('express');
const router = express.Router();
const User = require('./user');
const Student = require('./student');
const Post = require('./post');
const Event = require('./events');
const multer = require('multer');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// AWS S3 Configuration
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIAS3VBSOLOZKLXOVEC', // Your access key ID
    secretAccessKey: 'P78hbQvRSfWNkqjJUp7tjPwkmh1eN77spj7Pi2/8', // Your secret key
  },
});

const bucketName = 'extralumnos';

// Configure multer for local storage before uploading to S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload to S3
async function uploadToS3(file, folderName) {
  const key = `${folderName}/${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${bucketName}.s3.amazonaws.com/${key}`; // Return the public file URL
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

// Registration Route with Image Upload
router.post('/register', upload.fields([{ name: 'profilePic' }, { name: 'bannerPic' }]), async (req, res) => {
  const { name, college, branch, year, email, password, confirmPassword, profilePic, bannerPic } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered!' });
      }

      let profilePicUrl = null;
      let bannerPicUrl = null;

      // Upload files to S3
      if (req.files['profilePic']) {
        profilePicUrl = await uploadToS3(req.files['profilePic'][0], 'images/profilePics');
      }

      if (req.files['bannerPic']) {
        bannerPicUrl = await uploadToS3(req.files['bannerPic'][0], 'images/bannerPics');
      }

      const newUser = new User({
        name,
        college,
        branch,
        year,
        email,
        password,
        status: 'pending',
        profilePic: profilePicUrl,
        bannerPic: bannerPicUrl,
      });

      await newUser.save();
      res.json({ message: 'Registration successful! Please wait for admin approval.' });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'An error occurred during registration.' });
    }
  }
);
// Student Registration Route
router.post('/register-student', upload.fields([{ name: 'profilePic' }, { name: 'bannerPic' }]), async (req, res) => {
  const { name, college, branch, year, email, password, confirmPassword, profilePic, bannerPic } = req.body;

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

    let profilePicUrl = null;
      let bannerPicUrl = null;

      // Upload files to S3
      if (req.files['profilePic']) {
        profilePicUrl = await uploadToS3(req.files['profilePic'][0], 'images/profilePics');
      }

      if (req.files['bannerPic']) {
        bannerPicUrl = await uploadToS3(req.files['bannerPic'][0], 'images/bannerPics');
      }

    const newStudent = new Student({
      name,
      college,
      branch,
      year,
      email,
      password, // Store the plain-text password directly
      profilePic: profilePicUrl,
      bannerPic: bannerPicUrl,
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
        return res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email, branch: user.branch, year: user.year, college: user.college, profilePic: user.profilePic, bannerPic : user.bannerPic}});
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
      return res.status(200).json({ message: 'Login successful', student: { name: student.name, email: student.email, branch: student.branch, year: student.year, college: student.college, profilePic: student.profilePic, bannerPic : student.bannerPic}});
  } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

// Create Post
router.post('/post', async (req, res) => {
  const {name, email, branch,title, post, year, profilePic, bannerPic, category} = req.body;

  try {
    const newPost = new Post({
      name,
      email,
      title,
      post,
      branch,
      year,
      profilePic,
      bannerPic,
      category,
    });

    await newPost.save();
    res.json({ message: 'Post Created!' });
  } catch (error) {
    console.error('Cannot Create Post:', error);
    res.status(500).json({ error: 'An error occurred while creating post.' });
  }
});

router.post('/fetch-profile-student', async (req, res) => {
  const {email} = req.body;  // Get email and password from the request

  try {
      // Find the student by email
      const profile = await Student.findOne({ email });

      if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
      }

      // Successful login
      return res.status(200).json({
        message: 'Profile Found',
        profile: {
          name: profile.name,      // Correct: Use 'profile'
          email: profile.email,
          branch: profile.branch,
          year: profile.year,
          college: profile.college,
          profilePic: profile.profilePic,
          bannerPic: profile.bannerPic
        }
      });
  } catch (err) {
      console.error('Error finding profile:', err);
      res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

router.post('/fetch-profile-user', async (req, res) => {
  const {email} = req.body;  // Get email and password from the request

  try {
      // Find the user by email
      const profile = await User.findOne({ email });

      if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
      }

      // Successful login
      return res.status(200).json({
        message: 'Profile Found',
        profile: {
          name: profile.name,      // Correct: Use 'profile'
          email: profile.email,
          branch: profile.branch,
          year: profile.year,
          college: profile.college,
          profilePic: profile.profilePic,
          bannerPic: profile.bannerPic
        }
      });
  } catch (err) {
      console.error('Error finding profile:', err);
      res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

router.post('/update-profile', upload.fields([{ name: 'profilePic' }, { name: 'bannerPic' }]), async (req, res) => {
  const { name, About, LinkedIn, Insta, Github } = req.body;
  const email = localStorage.getItem('email');

  try {
    // Search for the user by name or email
    const user = await Student.findOne({ email });  // You can also use email or another identifier
    
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    let profilePicUrl = null;
    let bannerPicUrl = null;

    // Update the user profile fields
    user.About = About || user.About;  // Keep existing if new value is not provided
    user.LinkedIn = LinkedIn || user.LinkedIn;
    user.Insta = Insta || user.Insta;
    user.Github = Github || user.Github;

    // Handle profile picture upload (if provided)
    if (req.files['profilePic']) {
      profilePicUrl = await uploadToS3(req.files['profilePic'][0], 'images/profilePics');
    }

    if (req.files['bannerPic']) {
      bannerPicUrl = await uploadToS3(req.files['bannerPic'][0], 'images/bannerPics');
    }

    // Save the updated user profile
    await user.save();
    res.json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'An error occurred during profile update.' });
  }
});

router.put('/sub', async (req, res) => {
  const { email } = req.body; // Retrieve email from request body
  
  try {
      // Find the user by email and update their subscription status to "processing"
      const user = await User.findOneAndUpdate(
          { email: email }, 
          { $set: { subscription: 'processing' } }, // Update status (if subscriptionStatus is not already in the schema, manage using separate collection or flag)
          { new: true }
      );
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'Subscription is now processing.' });
  } catch (error) {
      console.error('Error during subscription processing:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/pending/subscribers', async (req, res) => {
  try {
    console.log('Fetching pending subscribers'); // Log when the route is hit
    
    const pendingSubscribers = await User.find({ subscription: 'processing' });
    
    if (pendingSubscribers.length === 0) {
      console.log('No pending subscribers found');
      return res.status(200).json([]); // Return empty array if no pending subscribers
    }

    console.log('Pending subscribers:', pendingSubscribers); // Log the result
    res.status(200).json(pendingSubscribers);
  } catch (error) {
    console.error('Error fetching pending subscribers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/api/:action/subscriber/:subscriberId', async (req, res) => {
  const { action, subscriberId } = req.params;

  if (action !== 'approve' && action !== 'reject') {
    return res.status(400).json({ error: 'Invalid action. Action must be "approve" or "reject".' });
  }

  try {
    // Find the subscriber by their ID
    const subscriber = await Subscriber.findById(subscriberId);
    
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found.' });
    }

    // Update subscription status
    if (action === 'approve') {
      subscriber.subscription = 'approved'; // Assuming your model has a `subscriptionStatus` field
    } else if (action === 'reject') {
      subscriber.subscription = 'rejected';
    }

    // Save the updated subscriber
    await subscriber.save();

    // Send success response
    return res.json({
      message: `Subscriber has been ${action === 'approve' ? 'approved' : 'rejected'}!`
    });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return res.status(500).json({ error: 'An error occurred while updating the subscriber.' });
  }
});


router.post('/event', async (req, res) => {
  const {name, email, branch, title, event, college, link, year, profilePic, bannerPic, category, location} = req.body;

  try {
    const newEvent = new Event({
      name,
      email,
      title,
      event,
      link,
      college,
      branch,
      year,
      profilePic,
      bannerPic,
      category,
      location,
    });

    await newEvent.save();
    res.json({ message: 'Event Created!' });
  } catch (error) {
    console.error('Cannot Create Event:', error);
    res.status(500).json({ error: 'An error occurred while creating event.' });
  }
});


module.exports=router;