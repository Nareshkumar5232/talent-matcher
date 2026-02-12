const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// dotenv only needed locally, Vercel injects env vars automatically
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not available, that's fine on Vercel
}

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
let jobsRouter, candidatesRouter, statsRouter, uploadRouter;
try {
    jobsRouter = require('../backend/routes/jobs.cjs');
    candidatesRouter = require('../backend/routes/candidates.cjs');
    statsRouter = require('../backend/routes/stats.cjs');
    uploadRouter = require('../backend/routes/upload.cjs');
} catch (err) {
    console.error('Failed to load routes:', err);
}

// Ensure DB connects before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('DB connection middleware error:', err);
    }
    next();
});

if (jobsRouter) app.use('/api/jobs', jobsRouter);
if (candidatesRouter) app.use('/api/candidates', candidatesRouter);
if (statsRouter) app.use('/api/stats', statsRouter);
if (uploadRouter) app.use('/api/upload', uploadRouter);

app.get('/api', (req, res) => {
    res.json({ 
        status: 'API is running',
        mongoUri: process.env.MONGO_URI ? 'configured' : 'not configured',
        dbState: mongoose.connection.readyState
    });
});

app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: err.message });
});

module.exports = app;
