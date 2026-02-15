const express = require('express');
const router = express.Router();
const JobService = require('../services/JobService.cjs');

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await JobService.findAll();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a job
router.post('/', async (req, res) => {
    try {
        const newJob = await JobService.create(req.body);
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a job
router.put('/:id', async (req, res) => {
    try {
        const job = await JobService.findByIdAndUpdate(req.params.id, req.body);
        res.json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a job
router.delete('/:id', async (req, res) => {
    try {
        await JobService.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
