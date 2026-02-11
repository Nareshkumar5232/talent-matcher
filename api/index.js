const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB();

// Routes
const jobsRouter = require('../backend/routes/jobs');
const candidatesRouter = require('../backend/routes/candidates');
const statsRouter = require('../backend/routes/stats');
// const uploadRouter = require('../backend/routes/upload'); // Require multer fix for serverless if used

app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/stats', statsRouter);
// app.use('/api/upload', uploadRouter); // Commented out for now as multer might need specific Vercel handling

app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;
