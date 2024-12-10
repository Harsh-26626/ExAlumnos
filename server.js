const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import the DB connection function
const authRoutes = require('./authroutes'); // Import routes

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes); // Use routes for /register, /approve, /login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
