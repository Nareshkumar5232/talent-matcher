require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize Firebase
const { initializeFirebase } = require('./config/firebase.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase connection
try {
    initializeFirebase();
    console.log('Firebase Firestore connected');
} catch (err) {
    console.error('Firebase initialization error:', err.message);
    console.error('Please configure Firebase credentials.');
}

// Routes
const jobsRouter = require('./routes/jobs.cjs');
const candidatesRouter = require('./routes/candidates.cjs');
const statsRouter = require('./routes/stats.cjs');
const uploadRouter = require('./routes/upload.cjs');

app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        database: 'Firebase Firestore',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
