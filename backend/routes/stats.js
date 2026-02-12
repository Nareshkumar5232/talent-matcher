const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Activity = require('../models/Activity');
const Job = require('../models/Job');

// Helper to get start of week
const getStartOfWeek = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay()); // Sunday
    return d;
};

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

        // Calculate Weekly Changes (This week vs Last week)
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const newCandidatesThisWeek = await Candidate.countDocuments({ appliedDate: { $gte: oneWeekAgo } });
        const newCandidatesLastWeek = await Candidate.countDocuments({ appliedDate: { $gte: twoWeeksAgo, $lt: oneWeekAgo } });

        const processedThisWeek = await Activity.countDocuments({ timestamp: { $gte: oneWeekAgo }, type: { $in: ['review', 'shortlist', 'reject'] } });
        const processedLastWeek = await Activity.countDocuments({ timestamp: { $gte: twoWeeksAgo, $lt: oneWeekAgo }, type: { $in: ['review', 'shortlist', 'reject'] } });

        const shortlistedThisWeek = await Activity.countDocuments({ timestamp: { $gte: oneWeekAgo }, type: 'shortlist' });
        const shortlistedLastWeek = await Activity.countDocuments({ timestamp: { $gte: twoWeeksAgo, $lt: oneWeekAgo }, type: 'shortlist' });

        res.json({
            totalCandidates,
            resumesProcessed,
            shortlistedCandidates,
            averageSkillMatch,
            weeklyChange: {
                candidates: newCandidatesThisWeek - newCandidatesLastWeek,
                processed: processedThisWeek - processedLastWeek,
                shortlisted: shortlistedThisWeek - shortlistedLastWeek,
                skillMatch: 0, // Hard to calc historic avg without snapshots, leaving 0 or mock
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Activity Data
router.get('/activity', async (req, res) => {
    try {
        // Recent activity feed
        const recentActivity = await Activity.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        // Map _id to id for frontend
        const mappedRecent = recentActivity.map(a => ({
            id: a._id,
            type: a.type,
            candidateName: a.candidateName,
            jobTitle: a.jobTitle,
            timestamp: a.timestamp,
            user: a.user
        }));

        // Processing activity data for chart (Last 7 days)
        const processingActivityData = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i)); // Go back 6, 5, ... 0 days
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            // We need to count by day. This is a bit expensive in a loop but fine for small scale.
            // Better to use aggregate in production.
            const uploads = await Activity.countDocuments({ type: 'upload', timestamp: { $gte: startOfDay, $lte: endOfDay } });
            const processed = await Activity.countDocuments({ type: { $in: ['review', 'shortlist', 'reject'] }, timestamp: { $gte: startOfDay, $lte: endOfDay } });
            const shortlisted = await Activity.countDocuments({ type: 'shortlist', timestamp: { $gte: startOfDay, $lte: endOfDay } });

            processingActivityData.push({
                date: startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                uploads,
                processed,
                shortlisted
            });
        }

        res.json({ processingActivityData, recentActivity: mappedRecent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Skills Data
router.get('/skills', async (req, res) => {
    try {
        const candidates = await Candidate.find();

        // 1. Calculate Skill Matches (Gap Analysis)
        // Since we don't have a "Required Skills" source of truth easily available without a specific Job reference,
        // we will look at the 'matchedSkills' field across all candidates assuming it was populated during upload/scoring.
        // If matchedSkills is empty (legacy/unscored), we count 'skills'.

        const skillCounts = {};
        const totalCandidates = candidates.length;

        candidates.forEach(c => {
            const skillsToCount = c.matchedSkills && c.matchedSkills.length > 0 ? c.matchedSkills : c.skills;
            skillsToCount.forEach(skill => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });

        // Convert to array
        const skillGapData = Object.keys(skillCounts).map(skill => ({
            skill,
            candidates: totalCandidates,
            matched: skillCounts[skill]
        })).sort((a, b) => b.matched - a.matched).slice(0, 10); // Top 10 skills

        // 2. Match Distribution
        const matchDistributionData = [
            { range: '90-100%', count: candidates.filter(c => c.overallScore >= 90).length, color: 'hsl(142, 76%, 36%)' },
            { range: '80-89%', count: candidates.filter(c => c.overallScore >= 80 && c.overallScore < 90).length, color: 'hsl(217, 91%, 60%)' },
            { range: '70-79%', count: candidates.filter(c => c.overallScore >= 70 && c.overallScore < 80).length, color: 'hsl(38, 92%, 50%)' },
            { range: '60-69%', count: candidates.filter(c => c.overallScore >= 60 && c.overallScore < 70).length, color: 'hsl(0, 72%, 51%)' },
            { range: '<60%', count: candidates.filter(c => c.overallScore < 60).length, color: 'hsl(0, 72%, 40%)' },
        ];

        // 3. Top Matched Skills (Rate)
        // We can reuse skillGapData for this, but maybe formatted differently
        const topMatchedSkillsData = skillGapData.map(item => ({
            skill: item.skill,
            matchRate: Math.round((item.matched / item.candidates) * 100)
        }));

        res.json({ skillGapData, matchDistributionData, topMatchedSkillsData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
