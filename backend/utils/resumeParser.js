const fs = require('fs');
const path = require('path');
let pdf = require('pdf-parse');
const mammoth = require('mammoth');

// Handle pdf-parse export structure variations
if (typeof pdf !== 'function' && pdf.default) {
    pdf = pdf.default;
}

// Common tech skills to look for
const COMMON_SKILLS = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET', 'SQL', 'MongoDB', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Agile', 'Scrum', 'Machine Learning', 'AI', 'Data Science'
];

async function extractText(filePath) {
    const absolutePath = path.resolve(filePath);
    console.log(`Extracting text from: ${absolutePath}`);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`File not found at path: ${absolutePath}`);
    }

    const ext = path.extname(absolutePath).toLowerCase();

    if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(absolutePath);
        // Ensure pdf is a function before calling
        if (typeof pdf !== 'function') {
            throw new Error('PDF parser library not initialized correctly. "pdf" is not a function.');
        }
        const data = await pdf(dataBuffer);
        return data.text;
    } else if (ext === '.docx') {
        try {
            const result = await mammoth.extractRawText({ path: absolutePath });
            return result.value;
        } catch (error) {
            if (error.message && error.message.includes('end of central directory')) {
                throw new Error('Invalid DOCX file. This might be a .doc file renamed to .docx, or the file is corrupted.');
            }
            throw error;
        }
    } else {
        throw new Error('Retrieved file is not a supported format (PDF or DOCX required)');
    }
}

function extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
}

function extractPhone(text) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : null;
}

function extractName(text) {
    // Basic heuristic: First line or first non-empty line that looks like a name
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Check first few lines for a likely name (capitalized words, not too long)
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line) && line.length < 50) {
            return line;
        }
    }
    return 'Unknown Candidate';
}

function extractSkills(text) {
    const skills = new Set();
    const lowerText = text.toLowerCase();

    COMMON_SKILLS.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            skills.add(skill);
        }
    });

    return Array.from(skills);
}

function extractExperience(text) {
    // Very basic heuristic: look for "years" near "experience"
    // Or just count years mentioned
    const expRegex = /(\d+)\+?\s*years?/i;
    const match = text.match(expRegex);
    if (match) return parseInt(match[1]);

    // Look for date ranges (e.g. 2018 - Present, 2015-2018)
    const yearRegex = /\b(19|20)\d{2}\b/g;
    const years = text.match(yearRegex);
    if (years && years.length >= 2) {
        const uniqueYears = [...new Set(years)].map(Number).sort((a, b) => a - b);
        if (uniqueYears.length >= 2) {
            return uniqueYears[uniqueYears.length - 1] - uniqueYears[0];
        }
    }

    return 0; // Default
}

async function parseResume(filePath) {
    try {
        const text = await extractText(filePath);

        return {
            name: extractName(text),
            email: extractEmail(text),
            phone: extractPhone(text),
            skills: extractSkills(text),
            experience: extractExperience(text),
            summary: text.slice(0, 200) + '...', // Brief summary
        };
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw error;
    }
}

module.exports = { parseResume };
