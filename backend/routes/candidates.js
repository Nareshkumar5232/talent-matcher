const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Get all candidates
const Activity = require('../models/Activity');

// ... (existing GET) ...
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a candidate
router.post('/', async (req, res) => {
    const candidate = new Candidate(req.body);
    try {
        const newCandidate = await candidate.save();
        await Activity.create({
            type: 'create',
            candidateName: newCandidate.name,
            jobTitle: 'General Application', // Or specific job from req.body
            user: 'HR Admin'
        });
        res.status(201).json(newCandidate);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Update candidate
router.put('/:id', async (req, res) => {
    try {
        const oldCandidate = await Candidate.findById(req.params.id);
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Log status changes
        if (oldCandidate && req.body.status && req.body.status !== oldCandidate.status) {
            const type = req.body.status === 'shortlisted' ? 'shortlist' :
                req.body.status === 'rejected' ? 'reject' :
                    req.body.status === 'reviewed' ? 'review' : 'update';

            await Activity.create({
                type: type,
                candidateName: candidate.name,
                jobTitle: 'General Application',
                user: 'HR Admin'
            });
        }

        res.json(candidate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (candidate) {
            await Activity.create({
                type: 'delete',
                candidateName: candidate.name,
                jobTitle: 'General Application',
                user: 'HR Admin'
            });
        }
        await Candidate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Candidate deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
