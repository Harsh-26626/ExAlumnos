const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://Vinay053:vkc%40545506@exalumnos.zked1.mongodb.net/ExAlumnos?retryWrites=true&w=majority';

const connectDB = () => {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Connected to MongoDB Atlas!');
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
      });
};

module.exports = connectDB;
