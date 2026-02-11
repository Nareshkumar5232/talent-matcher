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

// Upload and parse resume
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Simulate parsing logic
        // In a real app, you would use a library like pdf-parse or mammoth to extract text

        // Create a new candidate based on the uploaded file
        // Random mock data just for demonstration since we don't have real parsing
        const newCandidate = new Candidate({
            name: 'Parsed ' + req.file.originalname.split('.')[0],
            email: `tbd-${Date.now()}@example.com`,
            phone: '+1 (555) 000-0000',
            location: 'Unknown',
            experience: Math.floor(Math.random() * 10),
            education: 'Bachelor\'s Degree',
            skills: ['HTML', 'CSS', 'JavaScript'], // Default skills
            resumeUrl: req.file.path,
            status: 'new',
            skillMatch: Math.floor(Math.random() * 100),
            overallScore: Math.floor(Math.random() * 100),
            matchedSkills: [],
            missingSkills: [],
            experienceMatch: Math.floor(Math.random() * 100),
            educationMatch: Math.floor(Math.random() * 100),
            summary: 'Automatically created from resume upload.',
        });

        await newCandidate.save();

        res.status(201).json({
            message: 'Resume uploaded and processed successfully',
            candidate: newCandidate,
            // For immediate frontend display similar to simulation
            parsedData: {
                name: newCandidate.name,
                email: newCandidate.email,
                skills: newCandidate.skills,
                experience: `${newCandidate.experience} years`
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
