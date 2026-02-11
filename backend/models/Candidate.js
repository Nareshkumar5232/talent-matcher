const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    location: String,
    experience: Number,
    education: String,
    skills: [String],
    matchedSkills: [String],
    missingSkills: [String],
    skillMatch: Number,
    experienceMatch: Number,
    educationMatch: Number,
    overallScore: Number,
    rank: { type: Number, default: 0 },
    resumeUrl: String,
    appliedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['new', 'reviewed', 'shortlisted', 'rejected'], default: 'new' },
    summary: String,
});

module.exports = mongoose.model('Candidate', CandidateSchema);
