const express = require('express');
const router = express.Router();
const CandidateService = require('../services/CandidateService.cjs');
const ActivityService = require('../services/ActivityService.cjs');

const getMockCandidates = () => ([
    { _id: '1', name: 'Demo Sarah', email: 'sarah@demo.com', status: 'shortlisted', skillMatch: 95, overallScore: 92, skills: ['React', 'Node'], experience: 5 },
    { _id: '2', name: 'Demo Mike', email: 'mike@demo.com', status: 'reviewed', skillMatch: 85, overallScore: 80, skills: ['Python', 'Django'], experience: 3 },
    { _id: '3', name: 'Demo Emily', email: 'emily@demo.com', status: 'new', skillMatch: 75, overallScore: 70, skills: ['Java', 'Spring'], experience: 2 }
]);

// Get all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await CandidateService.findAll();
        res.json(candidates);
    } catch (err) {
        console.error('Candidates Error:', err);
        // Fallback to mock on error
        res.json(getMockCandidates());
    }
});

// Create a candidate
router.post('/', async (req, res) => {
    try {
        const newCandidate = await CandidateService.create(req.body);
        await ActivityService.create({
            type: 'create',
            candidateName: newCandidate.name,
            jobTitle: 'General Application',
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
        const oldCandidate = await CandidateService.findById(req.params.id);
        const candidate = await CandidateService.findByIdAndUpdate(req.params.id, req.body);

        // Log status changes
        if (oldCandidate && req.body.status && req.body.status !== oldCandidate.status) {
            const type = req.body.status === 'shortlisted' ? 'shortlist' :
                req.body.status === 'rejected' ? 'reject' :
                    req.body.status === 'reviewed' ? 'review' : 'update';

            await ActivityService.create({
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
        const candidate = await CandidateService.findById(req.params.id);
        if (candidate) {
            await ActivityService.create({
                type: 'delete',
                candidateName: candidate.name,
                jobTitle: 'General Application',
                user: 'HR Admin'
            });
        }
        await CandidateService.findByIdAndDelete(req.params.id);
        res.json({ message: 'Candidate deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
