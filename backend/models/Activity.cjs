const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['upload', 'shortlist', 'reject', 'review', 'create', 'update', 'delete'],
        required: true
    },
    candidateName: { type: String, required: true },
    jobTitle: { type: String, default: 'General Application' },
    timestamp: { type: Date, default: Date.now },
    user: { type: String, default: 'HR Admin' }, // In a real app, this would be the logged-in user
    details: { type: String } // Optional specific details
});

module.exports = mongoose.model('Activity', ActivitySchema);
