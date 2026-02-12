const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    // Check if MONGO_URI is defined to prevent crash
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI environment variable not found. Running in offline/mock mode.');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Routes - use path relative to api folder for Vercel
const jobsRouter = require('../backend/routes/jobs');
const candidatesRouter = require('../backend/routes/candidates');
const statsRouter = require('../backend/routes/stats');
const uploadRouter = require('../backend/routes/upload');

// Ensure DB connects before handling requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/upload', uploadRouter);

app.get('/api', (req, res) => {
    res.json({ status: 'API is running' });
});

app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

module.exports = app;
