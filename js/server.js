const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import the DB connection function
const authRoutes = require('./authroutes'); // Import routes for authentication

const app = express();

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

// API Endpoint to Fetch Alumni Data
app.get('/api/alumni', async (req, res) => {
  try {
      const alumni = await User.find({ status: 'approved' }); // Fetch only alumni with status 'pending'
      res.json(alumni); // Send data as JSON
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch alumni data' });
  }
});

// Use routes for authentication and user actions like register, approve, etc.
app.use('/api', authRoutes); // Use the routes defined in authroutes.js for handling /register, /approve, etc.

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});