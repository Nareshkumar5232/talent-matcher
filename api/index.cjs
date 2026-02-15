const express = require('express');
const cors = require('cors');
const path = require('path');

// dotenv only needed locally, Vercel injects env vars automatically
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not available, that's fine on Vercel
}

// Initialize Firebase
const { initializeFirebase, getFirestore } = require('../backend/config/firebase.cjs');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Firebase initialization status
let firebaseInitialized = false;
let firebaseError = null;

// Initialize Firebase on startup
const initFirebase = () => {
    if (firebaseInitialized) return true;
    
    try {
        initializeFirebase();
        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
        return true;
    } catch (err) {
        firebaseError = err.message;
        console.error('Firebase initialization failed:', err.message);
        return false;
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

// Ensure Firebase initializes before handling requests
app.use(async (req, res, next) => {
    // Skip Firebase check for health check endpoints
    if (req.path === '/api' || req.path === '/') {
        return next();
    }
    
    if (!initFirebase()) {
        return res.status(503).json({ 
            error: 'Database connection failed', 
            message: firebaseError || 'Firebase not configured'
        });
    }
    
    next();
});

if (jobsRouter) app.use('/api/jobs', jobsRouter);
if (candidatesRouter) app.use('/api/candidates', candidatesRouter);
if (statsRouter) app.use('/api/stats', statsRouter);
if (uploadRouter) app.use('/api/upload', uploadRouter);

app.get('/api', (req, res) => {
    const isConfigured = !!(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_PROJECT_ID);
    res.json({ 
        status: 'API is running',
        database: 'Firebase Firestore',
        firebaseConfigured: isConfigured,
        firebaseInitialized: firebaseInitialized,
        error: firebaseError
    });
});

// Debug endpoint to test Firebase connection
app.get('/api/debug', async (req, res) => {
    try {
        const isConfigured = !!(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_PROJECT_ID);
        
        if (initFirebase()) {
            // Try a simple Firestore operation to verify connection
            const db = getFirestore();
            const testRef = db.collection('_health_check');
            
            res.json({
                firebaseConfigured: isConfigured,
                firebaseInitialized: true,
                status: 'connected',
                projectId: process.env.FIREBASE_PROJECT_ID || 'from service account'
            });
        } else {
            res.status(500).json({
                firebaseConfigured: isConfigured,
                firebaseInitialized: false,
                error: firebaseError
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
            firebaseConfigured: !!(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_PROJECT_ID)
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
