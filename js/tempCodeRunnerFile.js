const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import the DB connection function
const authRoutes = require('./authroutes'); // Import routes for authentication and other actions

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve static files for images (optional if using local file server)
app.use('/uploads', express.static('uploads'));

// Use routes for authentication and user actions like register, approve, etc.
app.use('/api', authRoutes); // Routes are defined in authroutes.js

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
