const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CandidateService = require('../services/CandidateService.cjs');
const ActivityService = require('../services/ActivityService.cjs');
const fs = require('fs');
const os = require('os');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

// Configure storage for file uploads
const storage = multer.memoryStorage();

// Only accept image files
const SUPPORTED_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg'
];

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (PNG, JPG) are allowed!'), false);
        }
    }
});

// Resume keywords to verify if image is a resume
const RESUME_KEYWORDS = [
    'experience', 'education', 'skills', 'resume', 'cv', 'curriculum vitae',
    'work history', 'employment', 'qualification', 'objective', 'summary',
    'professional', 'contact', 'email', 'phone', 'address', 'linkedin',
    'github', 'portfolio', 'project', 'achievement', 'certification',
    'degree', 'bachelor', 'master', 'university', 'college', 'school',
    'company', 'position', 'role', 'responsibility', 'intern', 'developer',
    'engineer', 'manager', 'analyst', 'designer', 'reference'
];

// Common skills to extract (tech + general)
const TECH_SKILLS = [
    // Programming languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
    // Frameworks
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'next.js', 'nuxt',
    // Web technologies
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'webpack', 'vite',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'dynamodb', 'oracle', 'sqlite',
    // DevOps & Cloud
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd', 'devops',
    // OS & Tools
    'linux', 'windows', 'macos', 'agile', 'scrum', 'jira', 'trello', 'slack',
    // AI/ML
    'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'deep learning', 'nlp',
    // Design
    'figma', 'photoshop', 'illustrator', 'ui/ux', 'design', 'graphic design', 'adobe', 'sketch', 'canva', 'indesign',
    // General skills
    'leadership', 'management', 'communication', 'teamwork', 'problem solving', 'analytical',
    'marketing', 'sales', 'customer service', 'project management', 'excel', 'powerpoint', 'word',
    'accounting', 'finance', 'hr', 'recruiting', 'training', 'presentation', 'writing', 'editing'
];

// Check if extracted text is likely a resume
const isResumeText = (text) => {
    const lowerText = text.toLowerCase();
    let matchCount = 0;
    
    for (const keyword of RESUME_KEYWORDS) {
        if (lowerText.includes(keyword)) {
            matchCount++;
        }
    }
    
    // Also check for email pattern (strong indicator of resume/CV)
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    
    // Check for phone pattern
    const hasPhone = /(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/.test(text);
    
    // Check for any tech skill
    let hasSkill = false;
    for (const skill of TECH_SKILLS) {
        if (lowerText.includes(skill.toLowerCase())) {
            hasSkill = true;
            break;
        }
    }
    
    console.log(`Resume validation: keywords=${matchCount}, hasEmail=${hasEmail}, hasPhone=${hasPhone}, hasSkill=${hasSkill}, textLength=${text.length}`);
    
    // Accept if: any keywords, email/phone, tech skill, OR any meaningful text extracted (>10 chars)
    // Stylized resumes are hard for OCR, so be lenient if there's any text
    return matchCount >= 1 || hasEmail || hasPhone || hasSkill || text.length > 10;
};

// Extract candidate info from OCR text
const extractCandidateInfo = (text, originalFilename = '') => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : null;
    
    // Extract phone
    const phoneMatch = text.match(/(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/);
    const phone = phoneMatch ? phoneMatch[0] : null;
    
    // Extract name - try multiple patterns
    let name = null;
    
    // Pattern 1: Look for NAME.NAME or NAME_NAME format (common in stylized resumes)
    const dotNameMatch = text.match(/([A-Z][a-z]+)[._]([A-Z][a-z]+)/);
    if (dotNameMatch) {
        name = `${dotNameMatch[1]} ${dotNameMatch[2]}`;
    }
    
    // Pattern 2: ALL CAPS NAME (like "AUSTIN BRONSON" or "AUSTIN.BRONSON")
    if (!name) {
        const capsNameMatch = text.match(/([A-Z]{2,})[.\s_-]+([A-Z]{2,})/);
        if (capsNameMatch) {
            // Convert to Title Case
            const firstName = capsNameMatch[1].charAt(0) + capsNameMatch[1].slice(1).toLowerCase();
            const lastName = capsNameMatch[2].charAt(0) + capsNameMatch[2].slice(1).toLowerCase();
            name = `${firstName} ${lastName}`;
        }
    }
    
    // Pattern 3: Standard name format in text
    if (!name) {
        for (const line of lines.slice(0, 5)) {
            if (/^[A-Za-z\s]{3,50}$/.test(line) && line.split(/\s+/).length >= 2 && line.split(/\s+/).length <= 4) {
                name = line;
                break;
            }
        }
    }
    
    // Fallback: Use filename if no name found
    if (!name && originalFilename) {
        name = originalFilename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }
    
    // Extract skills
    const lowerText = text.toLowerCase();
    const foundSkills = TECH_SKILLS.filter(skill => lowerText.includes(skill.toLowerCase()));
    
    // Extract years of experience
    const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?/i);
    const experience = expMatch ? parseInt(expMatch[1]) : 0;
    
    console.log(`Extracted candidate: name=${name}, email=${email}, phone=${phone}, skills=${foundSkills.join(',')}`);
    
    return {
        name: name || 'Unknown Candidate',
        email: email || `candidate-${Date.now()}@example.com`,
        phone: phone || 'N/A',
        skills: foundSkills.length > 0 ? foundSkills : ['General'],
        experience: experience,
        summary: text.substring(0, 500)
    };
};

// Upload and parse resume image
router.post('/', upload.single('resume'), async (req, res) => {
    let tempFilePath = null;
    let processedFilePath = null;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const tempDir = os.tmpdir();
        tempFilePath = path.join(tempDir, `resume-${Date.now()}-${req.file.originalname}`);
        processedFilePath = path.join(tempDir, `processed-${Date.now()}.png`);
        
        // Preprocess image for better OCR accuracy
        console.log('Preprocessing image for OCR...');
        await sharp(req.file.buffer)
            .resize(2000, null, { // Upscale to improve text recognition
                withoutEnlargement: false,
                fit: 'inside'
            })
            .grayscale() // Convert to grayscale
            .normalize() // Improve contrast
            .sharpen() // Sharpen text edges
            .toFile(processedFilePath);
        
        console.log('Image preprocessed. Starting OCR analysis...');

        // Perform OCR on the preprocessed image with optimized settings
        const result = await Tesseract.recognize(processedFilePath, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                }
            }
        });

        const extractedText = result.data.text;
        console.log('OCR completed. Text length:', extractedText.length);
        console.log('Extracted text preview:', extractedText.substring(0, 500));

        // Verify if the image is a resume
        if (!isResumeText(extractedText)) {
            return res.status(400).json({ 
                message: 'The uploaded image does not appear to be a resume. Please upload a valid resume image.',
                hint: 'A resume should contain sections like Experience, Education, Skills, Contact information, etc.'
            });
        }

        // Extract candidate information from OCR text
        const parsedData = extractCandidateInfo(extractedText, req.file.originalname);

        const candidateData = {
            name: parsedData.name,
            email: parsedData.email,
            phone: parsedData.phone,
            location: 'Unknown',
            experience: parsedData.experience,
            education: 'Not specified',
            skills: parsedData.skills,
            resumeUrl: req.file.originalname,
            status: 'new',
            skillMatch: 0,
            overallScore: 0,
            matchedSkills: [],
            missingSkills: [],
            experienceMatch: 0,
            educationMatch: 0,
            summary: parsedData.summary || 'Extracted from resume image via OCR.',
        };

        const newCandidate = await CandidateService.create(candidateData);

        // Log activity
        await ActivityService.create({
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
        // Clean up temp files
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        if (processedFilePath && fs.existsSync(processedFilePath)) {
            fs.unlinkSync(processedFilePath);
        }
    }
});

module.exports = router;
