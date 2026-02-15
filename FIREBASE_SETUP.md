# Firebase Setup Guide

This guide will help you set up Firebase Firestore for the Talent Matcher application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "talent-matcher")
4. Follow the setup wizard (you can disable Google Analytics if desired)
5. Click "Create project"

## Step 2: Enable Firestore

1. In your Firebase project, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose your preferred location (closest to your users)
4. Start in **test mode** for development (you can add security rules later)
5. Click "Enable"

## Step 3: Generate Service Account Key

1. Go to "Project Settings" (gear icon) → "Service Accounts"
2. Make sure "Node.js" is selected
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `serviceAccountKey.json`
6. Place it in the `backend/config/` folder

**⚠️ IMPORTANT:** Never commit this file to git! It's already in `.gitignore`.

## Step 4: Configure Environment Variables

### For Local Development

Create a `.env` file in the `backend/` folder with:

```env
PORT=5000
```

The application will automatically use the `serviceAccountKey.json` file.

### For Production (Vercel/Heroku)

Set these environment variables:

**Option A: Full Service Account JSON**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project",...}
```

**Option B: Individual Variables**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Step 5: Run the Application

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

## Firestore Collections

The application uses the following collections:

- `candidates` - Stores candidate profiles and resume data
- `jobs` - Stores job descriptions and requirements
- `activities` - Stores activity logs (uploads, status changes, etc.)

## Security Rules (Production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### "Firebase credentials not configured"
- Make sure `serviceAccountKey.json` exists in `backend/config/`
- Or set the `FIREBASE_SERVICE_ACCOUNT` environment variable

### "Permission denied"
- Check your Firestore security rules
- Make sure your service account has the right permissions

### "Project not found"
- Verify the project ID in your service account matches your Firebase project
