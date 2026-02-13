const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Candidate = require('../models/Candidate.cjs');
const fs = require('fs');
const os = require('os');

// Configure storage for file uploads
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed!'), false);
        }
    }
});

const { parseResume } = require('../utils/resumeParser.cjs');

// Upload and parse resume
router.post('/', upload.single('resume'), async (req, res) => {
    let tempFilePath = null;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Write buffer to temp file for parsing
        const tempDir = os.tmpdir();
        tempFilePath = path.join(tempDir, `resume-${Date.now()}-${req.file.originalname}`);
        fs.writeFileSync(tempFilePath, req.file.buffer);

        // Real parsing logic
        const parsedData = await parseResume(tempFilePath);

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
            resumeUrl: req.file.originalname, // File not persisted in serverless without blob storage
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
        const Activity = require('../models/Activity.cjs');
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
    } finally {
        // Clean up temp file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
});

module.exports = router;
