const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Candidate = require('../models/Candidate');
const fs = require('fs');

// Configure storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed!'), false);
        }
    }
});

const { parseResume } = require('../utils/resumeParser');

// Upload and parse resume
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Real parsing logic
        const parsedData = await parseResume(req.file.path);

        if (!parsedData) {
            return res.status(400).json({ message: 'Failed to extract text from resume' });
        }

        // Create a new candidate based on parsed data
        const newCandidate = new Candidate({
            name: parsedData.name || 'Unknown Candidate',
            email: parsedData.email || `unknown-${Date.now()}@example.com`,
            phone: parsedData.phone || 'N/A',
            location: 'Unknown', // Location extraction is hard without NLP
            experience: parsedData.experience || 0,
            education: 'Bachelor\'s Degree', // Default if not found
            skills: parsedData.skills.length > 0 ? parsedData.skills : ['General'],
            resumeUrl: req.file.path.replace(/\\/g, '/'),
            status: 'new',
            skillMatch: 0, // Should be calculated against job description later
            overallScore: 0,
            matchedSkills: [],
            missingSkills: [],
            experienceMatch: 0,
            educationMatch: 0,
            summary: parsedData.summary || 'Automatically created from resume upload.',
        });

        await newCandidate.save();

        // Log activity
        const Activity = require('../models/Activity');
        await Activity.create({
            type: 'upload',
            candidateName: newCandidate.name,
            jobTitle: 'General Application',
            user: 'HR Admin'
        });

        res.status(201).json({
            message: 'Resume uploaded and processed successfully',
            candidate: newCandidate,
            // For immediate frontend display
            parsedData: {
                name: newCandidate.name,
                email: newCandidate.email,
                skills: newCandidate.skills,
                experience: `${newCandidate.experience} years`
            }
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: err.message || 'Server error during resume processing' });
    }
});

module.exports = router;
