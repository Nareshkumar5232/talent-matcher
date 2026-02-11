const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

// Mock helpers
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Get Dashboard Stats
router.get('/dashboard', async (req, res) => {
    try {
        const totalCandidates = await Candidate.countDocuments();
        const resumesProcessed = await Candidate.countDocuments({ status: { $in: ['reviewed', 'shortlisted', 'rejected'] } });
        const shortlistedCandidates = await Candidate.countDocuments({ status: 'shortlisted' });

        // Average skill match
        const result = await Candidate.aggregate([
            { $group: { _id: null, avgSkillMatch: { $avg: '$skillMatch' } } }
        ]);
        const averageSkillMatch = result.length > 0 ? Math.round(result[0].avgSkillMatch) : 0;

        res.json({
            totalCandidates,
            resumesProcessed,
            shortlistedCandidates,
            averageSkillMatch,
            weeklyChange: {
                candidates: getRandomInt(5, 15),
                processed: getRandomInt(5, 10),
                shortlisted: getRandomInt(1, 5),
                skillMatch: getRandomInt(-2, 5),
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Activity Data (Mock for now)
router.get('/activity', (req, res) => {
    const processingActivityData = Array.from({ length: 14 }, (_, i) => ({
        date: `Jan ${i + 1}`,
        uploads: getRandomInt(10, 50),
        processed: getRandomInt(5, 45),
        shortlisted: getRandomInt(1, 15),
    }));

    const recentActivity = [
        {
            id: '1',
            type: 'upload',
            candidateName: 'Sarah Johnson',
            jobTitle: 'Senior Frontend Developer',
            timestamp: new Date().toISOString(),
            user: 'HR Admin',
        },
        {
            id: '2',
            type: 'shortlist',
            candidateName: 'Michael Chen',
            jobTitle: 'Full Stack Engineer',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: 'John Smith',
        },
        {
            id: '3',
            type: 'review',
            candidateName: 'Emily Davis',
            jobTitle: 'Product Manager',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user: 'Jane Doe',
        },
        {
            id: '4',
            type: 'reject',
            candidateName: 'Robert Wilson',
            jobTitle: 'Data Scientist',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            user: 'HR Admin',
        },
        {
            id: '5',
            type: 'upload',
            candidateName: 'Lisa Anderson',
            jobTitle: 'UX Designer',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            user: 'HR Admin',
        },
    ];

    res.json({ processingActivityData, recentActivity });
});

// Get Skills Data (Mock/Semi-Real for now)
router.get('/skills', async (req, res) => {
    try {
        const candidates = await Candidate.find();

        // Calculate skill gap
        // This is simplified logic
        const skillGapData = [
            { skill: 'React', candidates: candidates.length, matched: Math.round(candidates.length * 0.9) },
            { skill: 'TypeScript', candidates: candidates.length, matched: Math.round(candidates.length * 0.7) },
            { skill: 'JavaScript', candidates: candidates.length, matched: Math.round(candidates.length * 0.95) },
            { skill: 'CSS', candidates: candidates.length, matched: Math.round(candidates.length * 0.9) },
            { skill: 'HTML', candidates: candidates.length, matched: Math.round(candidates.length * 0.95) },
            { skill: 'Next.js', candidates: candidates.length, matched: Math.round(candidates.length * 0.5) },
            { skill: 'GraphQL', candidates: candidates.length, matched: Math.round(candidates.length * 0.4) },
            { skill: 'Testing', candidates: candidates.length, matched: Math.round(candidates.length * 0.6) },
            { skill: 'Node.js', candidates: candidates.length, matched: Math.round(candidates.length * 0.65) },
        ];

        const matchDistributionData = [
            { range: '90-100%', count: candidates.filter(c => c.overallScore >= 90).length, color: 'hsl(142, 76%, 36%)' },
            { range: '80-89%', count: candidates.filter(c => c.overallScore >= 80 && c.overallScore < 90).length, color: 'hsl(217, 91%, 60%)' },
            { range: '70-79%', count: candidates.filter(c => c.overallScore >= 70 && c.overallScore < 80).length, color: 'hsl(38, 92%, 50%)' },
            { range: '60-69%', count: candidates.filter(c => c.overallScore >= 60 && c.overallScore < 70).length, color: 'hsl(0, 72%, 51%)' },
            { range: '<60%', count: candidates.filter(c => c.overallScore < 60).length, color: 'hsl(0, 72%, 40%)' },
        ];

        const topMatchedSkillsData = [
            { skill: 'JavaScript', matchRate: 98 },
            { skill: 'HTML', matchRate: 98 },
            { skill: 'CSS', matchRate: 96 },
            { skill: 'React', matchRate: 93 },
            { skill: 'TypeScript', matchRate: 78 },
            { skill: 'Node.js', matchRate: 67 },
            { skill: 'Testing', matchRate: 62 },
            { skill: 'Next.js', matchRate: 49 },
            { skill: 'GraphQL', matchRate: 40 },
        ];

        res.json({ skillGapData, matchDistributionData, topMatchedSkillsData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
