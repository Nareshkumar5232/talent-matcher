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

// MongoDB connection with proper serverless handling
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL environment variable not found');
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URL, opts).then((mongoose) => {
            console.log('MongoDB Connected');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
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
    // Skip DB connection for health check endpoints
    if (req.path === '/api' || req.path === '/') {
        return next();
    }
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB connection error:', err);
        return res.status(503).json({ 
            error: 'Database connection failed', 
            message: err.message 
        });
    }
});

if (jobsRouter) app.use('/api/jobs', jobsRouter);
if (candidatesRouter) app.use('/api/candidates', candidatesRouter);
if (statsRouter) app.use('/api/stats', statsRouter);
if (uploadRouter) app.use('/api/upload', uploadRouter);

app.get('/api', (req, res) => {
    res.json({ 
        status: 'API is running',
        mongoUri: process.env.MONGO_URL ? 'configured' : 'not configured',
        dbState: mongoose.connection.readyState,
        dbStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    });
});

// Debug endpoint to test DB connection
app.get('/api/debug', async (req, res) => {
    try {
        await connectDB();
        res.json({
            mongoConfigured: !!process.env.MONGO_URL,
            connectionState: mongoose.connection.readyState,
            connectionStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
            host: mongoose.connection.host || 'not connected'
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
            mongoConfigured: !!process.env.MONGO_URL
        });
    }
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
