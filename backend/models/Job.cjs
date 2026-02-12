const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: String,
    department: String,
    location: String,
    requiredSkills: [String],
    preferredSkills: [String],
    experience: { min: Number, max: Number },
    education: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
    candidateCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Job', JobSchema);
