const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// For local development, use a service account JSON file
// For production (Vercel), use environment variables

let app;

const initializeFirebase = () => {
    if (app) {
        return app;
    }

    try {
        // Check if already initialized
        app = admin.app();
        return app;
    } catch (e) {
        // Not initialized yet, proceed with initialization
    }

    // Option 1: Use service account JSON file (for local development)
    // Place your serviceAccountKey.json in the backend/config folder
    // Download from Firebase Console > Project Settings > Service Accounts
    
    // Option 2: Use environment variables (for production/Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Parse the JSON string from environment variable
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else if (process.env.FIREBASE_PROJECT_ID) {
        // Use individual environment variables
        app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            })
        });
    } else {
        // Try to load from local service account file
        try {
            const serviceAccount = require('./serviceAccountKey.json');
            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (err) {
            console.error('Firebase initialization error:', err.message);
            console.error('Please set up Firebase credentials:');
            console.error('1. Download serviceAccountKey.json from Firebase Console');
            console.error('2. Place it in backend/config/serviceAccountKey.json');
            console.error('OR set FIREBASE_SERVICE_ACCOUNT environment variable');
            throw new Error('Firebase credentials not configured');
        }
    }

    console.log('Firebase Admin SDK initialized');
    return app;
};

// Get Firestore instance
const getFirestore = () => {
    initializeFirebase();
    return admin.firestore();
};

// Collection names
const COLLECTIONS = {
    CANDIDATES: 'candidates',
    JOBS: 'jobs',
    ACTIVITIES: 'activities'
};

module.exports = {
    initializeFirebase,
    getFirestore,
    admin,
    COLLECTIONS
};
