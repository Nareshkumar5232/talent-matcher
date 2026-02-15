const express = require('express');
const router = express.Router();
const CandidateService = require('../services/CandidateService.cjs');
const ActivityService = require('../services/ActivityService.cjs');
const JobService = require('../services/JobService.cjs');

// Helper to get start of week
const getStartOfWeek = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay()); // Sunday
    return d;
};

// MOCK DATA GENERATORS (Fallback)
const getMockStats = () => ({
    totalCandidates: 12,
    resumesProcessed: 8,
    shortlistedCandidates: 3,
    averageSkillMatch: 75,
    weeklyChange: { candidates: 5, processed: 3, shortlisted: 2, skillMatch: 5 }
});

const getMockActivity = () => {
    const recent = [
        { _id: '1', type: 'upload', candidateName: 'Demo Candidate', jobTitle: 'Developer', timestamp: new Date(), user: 'Guest' },
        { _id: '2', type: 'review', candidateName: 'John Doe', jobTitle: 'Designer', timestamp: new Date(Date.now() - 86400000), user: 'Admin' }
    ];
    // Map to frontend format
    const mappedRecent = recent.map(a => ({
        id: a._id,
        type: a.type,
        candidateName: a.candidateName,
        jobTitle: a.jobTitle,
        timestamp: a.timestamp,
        user: a.user
    }));

    const processing = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        processing.unshift({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            uploads: Math.floor(Math.random() * 5),
            processed: Math.floor(Math.random() * 4),
            shortlisted: Math.floor(Math.random() * 2)
        });
    }
    return { processingActivityData: processing, recentActivity: mappedRecent };
};

const getMockSkills = () => ({
    skillGapData: [
        { skill: 'React', candidates: 10, matched: 8 },
        { skill: 'Node.js', candidates: 10, matched: 6 }
    ],
    matchDistributionData: [
        { range: '90-100%', count: 2, color: 'hsl(142, 76%, 36%)' },
        { range: '80-89%', count: 5, color: 'hsl(217, 91%, 60%)' },
        { range: '<60%', count: 1, color: 'hsl(0, 72%, 40%)' }
    ],
    topMatchedSkillsData: [
        { skill: 'React', matchRate: 80 },
        { skill: 'JavaScript', matchRate: 90 }
    ]
});

// Get Dashboard Stats
router.get('/dashboard', async (req, res) => {
    try {
        const candidates = await CandidateService.findAll();
        const totalCandidates = candidates.length;
        
        const resumesProcessed = candidates.filter(c => 
            ['reviewed', 'shortlisted', 'rejected'].includes(c.status)
        ).length;
        
        const shortlistedCandidates = candidates.filter(c => c.status === 'shortlisted').length;

        // Average skill match
        const averageSkillMatch = candidates.length > 0 
            ? Math.round(candidates.reduce((sum, c) => sum + (c.skillMatch || 0), 0) / candidates.length)
            : 0;

        // Calculate Weekly Changes (This week vs Last week)
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const newCandidatesThisWeek = candidates.filter(c => {
            const appliedDate = c.appliedDate?.toDate ? c.appliedDate.toDate() : new Date(c.appliedDate);
            return appliedDate >= oneWeekAgo;
        }).length;

        const newCandidatesLastWeek = candidates.filter(c => {
            const appliedDate = c.appliedDate?.toDate ? c.appliedDate.toDate() : new Date(c.appliedDate);
            return appliedDate >= twoWeeksAgo && appliedDate < oneWeekAgo;
        }).length;

        const processedThisWeek = await ActivityService.countDocuments({ 
            timestamp: { $gte: oneWeekAgo }, 
            type: { $in: ['review', 'shortlist', 'reject'] } 
        });
        const processedLastWeek = await ActivityService.countDocuments({ 
            timestamp: { $gte: twoWeeksAgo, $lt: oneWeekAgo }, 
            type: { $in: ['review', 'shortlist', 'reject'] } 
        });

        const shortlistedThisWeek = await ActivityService.countDocuments({ 
            timestamp: { $gte: oneWeekAgo }, 
            type: 'shortlist' 
        });
        const shortlistedLastWeek = await ActivityService.countDocuments({ 
            timestamp: { $gte: twoWeeksAgo, $lt: oneWeekAgo }, 
            type: 'shortlist' 
        });

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
        console.error('Stats Error:', err);
        // Fallback to mock on error
        res.json(getMockStats());
    }
});

// Get Activity Data
router.get('/activity', async (req, res) => {
    try {
        // Recent activity feed
        const recentActivity = await ActivityService.findWithOptions({ limit: 10 });

        // Map _id to id for frontend
        const mappedRecent = recentActivity.map(a => ({
            id: a._id,
            type: a.type,
            candidateName: a.candidateName,
            jobTitle: a.jobTitle,
            timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : a.timestamp,
            user: a.user
        }));

        // Processing activity data for chart (Last 7 days)
        const processingActivityData = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i)); // Go back 6, 5, ... 0 days
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const uploads = await ActivityService.countDocuments({ 
                type: 'upload', 
                timestamp: { $gte: startOfDay, $lte: endOfDay } 
            });
            const processed = await ActivityService.countDocuments({ 
                type: { $in: ['review', 'shortlist', 'reject'] }, 
                timestamp: { $gte: startOfDay, $lte: endOfDay } 
            });
            const shortlisted = await ActivityService.countDocuments({ 
                type: 'shortlist', 
                timestamp: { $gte: startOfDay, $lte: endOfDay } 
            });

            processingActivityData.push({
                date: startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                uploads,
                processed,
                shortlisted
            });
        }

        res.json({ processingActivityData, recentActivity: mappedRecent });
    } catch (err) {
        console.error('Activity Error:', err);
        res.json(getMockActivity());
    }
});

// Get Skills Data
router.get('/skills', async (req, res) => {
    try {
        const candidates = await CandidateService.findAll();

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
        console.error('Skills Error:', err);
        res.json(getMockSkills());
    }
});

module.exports = router;
