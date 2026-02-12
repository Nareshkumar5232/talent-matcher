const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    // Check if MONGO_URI is defined to prevent crash
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI environment variable not found. Running in offline/mock mode.');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB().catch(err => console.error('Initial DB connection error:', err));

// Routes
// Routes
const jobsRouter = require('../backend/routes/jobs');
const candidatesRouter = require('../backend/routes/candidates');
const statsRouter = require('../backend/routes/stats');
const uploadRouter = require('../backend/routes/upload');

app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;
