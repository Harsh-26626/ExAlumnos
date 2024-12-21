const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Event = require('./events');
const Job = require('./job');
const connectDB = require('./db'); // Import the DB connection function
const authRoutes = require('./authroutes'); // Import routes for authentication and other actions
const io = require('socket.io')(8000)

const app = express();

app.use('/Homepage', express.static('Homepage'));

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());


// Define the Alumni Schema
const userSchema = new mongoose.Schema({
  name: String,
  college: String,
  branch: String,
  year: String,
  email: String,
  password: String,
  status: String
});
// Create a Model for the 'users' Collection
const User = mongoose.models.User || mongoose.model('User', userSchema);
const postSchema = new mongoose.Schema({
name: String,
branch: String,
post: String,
year: String,
});
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
// API Endpoint to Fetch Alumni Data
app.get('/api/alumni', async (req, res) => {
try {
    const alumni = await User.find({ status: 'approved' }); // Fetch only alumni with status 'pending'
    res.json(alumni); // Send data as JSON
} catch (err) {
    res.status(500).json({ error: 'Failed to fetch alumni data' });
}
});
app.get('/api/events', async (req, res) => {
    try {
        const event = await Event.find(); // Fetch only alumni with status 'pending'
        res.json(event); // Send data as JSON
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch event data' });
    }
    });

    app.get('/api/jobs', async (req, res) => {
        try {
            const jobs = await Job.find(); // Fetch all job data
            res.json(jobs); // Send data as JSON
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch job data' });
        }
    });

app.get('/api/post', async (req, res) => {
try {
    const post = await Post.find();
    res.json(post); // Send data as JSON
} catch (err) {
    res.status(500).json({ error: 'Failed to fetch alumni data' });
}
});

app.get('/api/posts', async (req, res) => {
  const { email } = req.query;
  if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
  }

  try {
      // Find posts with the specific email
      const posts = await Post.find({ email });
      res.status(200).json(posts);
  } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
});

// Serve static files for images (optional if using local file server)
app.use('/uploads', express.static('uploads'));

// Use routes for authentication and user actions like register, approve, etc.
app.use('/api', authRoutes); // Routes are defined in authroutes.js

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
