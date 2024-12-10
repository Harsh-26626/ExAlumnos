const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db'); // Import the DB connection function
const bodyParser = require('body-parser');
const app = express();

// Enable CORS
app.use(cors());


// Connect to MongoDB
connectDB();

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
const User = mongoose.model('User', userSchema);

// API Endpoint to Fetch Alumni Data
app.get('/api/alumni', async (req, res) => {
    try {
        const alumni = await User.find(); // Fetch all documents from the 'users' collection
        res.json(alumni); // Send data as JSON
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch alumni data' });
    }
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
