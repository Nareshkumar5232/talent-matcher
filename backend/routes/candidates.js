const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Get all candidates
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
        res.status(201).json(newCandidate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update candidate
router.put('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(candidate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
    try {
        await Candidate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Candidate deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
