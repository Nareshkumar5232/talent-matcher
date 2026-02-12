const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./models/Candidate');
const Activity = require('./models/Activity');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const candidatesData = [
    {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '555-0101',
        location: 'San Francisco, CA',
        experience: 5,
        education: 'BS Computer Science',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        status: 'shortlisted',
        skillMatch: 92,
        overallScore: 88,
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        name: 'Michael Chen',
        email: 'm.chen@example.com',
        phone: '555-0102',
        location: 'New York, NY',
        experience: 8,
        education: 'MS Software Engineering',
        skills: ['Python', 'Django', 'AWS', 'Docker', 'Kubernetes'],
        status: 'reviewed',
        skillMatch: 85,
        overallScore: 82,
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '555-0103',
        location: 'Austin, TX',
        experience: 3,
        education: 'BS Information Systems',
        skills: ['JavaScript', 'HTML', 'CSS', 'React'],
        status: 'new',
        skillMatch: 75,
        overallScore: 70,
        appliedDate: new Date() // Today
    },
    {
        name: 'David Wilson',
        email: 'david.w@example.com',
        phone: '555-0104',
        location: 'Chicago, IL',
        experience: 6,
        education: 'BS Computer Science',
        skills: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
        status: 'rejected',
        skillMatch: 60,
        overallScore: 55,
        appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    },
    {
        name: 'Jessica Brown',
        email: 'j.brown@example.com',
        phone: '555-0105',
        location: 'Seattle, WA',
        experience: 4,
        education: 'BA Design',
        skills: ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping'],
        status: 'shortlisted',
        skillMatch: 95,
        overallScore: 94,
        appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
        name: 'Robert Taylor',
        email: 'robert.t@example.com',
        phone: '555-0106',
        location: 'Boston, MA',
        experience: 10,
        education: 'PhD Computer Science',
        skills: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch'],
        status: 'reviewed',
        skillMatch: 88,
        overallScore: 90,
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        phone: '555-0107',
        location: 'Denver, CO',
        experience: 2,
        education: 'Bootcamp Graduate',
        skills: ['React', 'JavaScript', 'CSS'],
        status: 'new',
        skillMatch: 65,
        overallScore: 60,
        appliedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
    }
];

const generateActivity = (candidate) => {
    const activities = [];

    // Upload activity for everyone
    activities.push({
        type: 'upload',
        candidateName: candidate.name,
        jobTitle: 'General Application',
        user: 'HR Admin',
        timestamp: candidate.appliedDate
    });

    // Status change activities
    if (candidate.status === 'shortlisted') {
        activities.push({
            type: 'shortlist',
            candidateName: candidate.name,
            jobTitle: 'Senior Developer',
            user: 'HR Admin',
            timestamp: new Date(candidate.appliedDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
        });
    } else if (candidate.status === 'rejected') {
        activities.push({
            type: 'reject',
            candidateName: candidate.name,
            jobTitle: 'General Application',
            user: 'HR Admin',
            timestamp: new Date(candidate.appliedDate.getTime() + 24 * 60 * 60 * 1000) // 1 day later
        });
    } else if (candidate.status === 'reviewed') {
        activities.push({
            type: 'review',
            candidateName: candidate.name,
            jobTitle: 'Tech Lead',
            user: 'John Doe',
            timestamp: new Date(candidate.appliedDate.getTime() + 1 * 60 * 60 * 1000) // 1 hour later
        });
    }

    return activities;
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Candidate.deleteMany({});
        await Activity.deleteMany({});
        console.log('Cleared existing data');

        // Insert Candidates
        const createdCandidates = await Candidate.insertMany(candidatesData);
        console.log(`Created ${createdCandidates.length} candidates`);

        // Insert Activities
        let allActivities = [];
        createdCandidates.forEach(candidate => {
            const acts = generateActivity(candidate);
            allActivities = [...allActivities, ...acts];
        });

        await Activity.insertMany(allActivities);
        console.log(`Created ${allActivities.length} activity logs`);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
