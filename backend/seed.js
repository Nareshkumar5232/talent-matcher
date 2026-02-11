const mongoose = require('mongoose');
const Job = require('./models/Job');
const Candidate = require('./models/Candidate');
require('dotenv').config();

const jobsData = [
    {
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        preferredSkills: ['Next.js', 'GraphQL', 'Testing', 'Node.js'],
        experience: { min: 5, max: 8 },
        education: "Bachelor's in Computer Science",
        description: 'We are looking for a Senior Frontend Developer.',
        status: 'active',
        candidateCount: 45,
    },
    {
        title: 'Full Stack Engineer',
        department: 'Engineering',
        location: 'New York, NY',
        requiredSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS'],
        preferredSkills: ['Kubernetes', 'Redis', 'GraphQL', 'TypeScript'],
        experience: { min: 3, max: 6 },
        education: "Bachelor's in CS",
        description: 'Join our team as a Full Stack Engineer.',
        status: 'active',
        candidateCount: 78,
    }
];

const candidatesData = [
    {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        experience: 6,
        education: "Bachelor's in CS",
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Next.js', 'GraphQL'],
        matchedSkills: ['React', 'TypeScript', 'JavaScript'],
        skillMatch: 95,
        rank: 1,
        status: 'shortlisted',
        summary: 'Experienced frontend developer.',
    },
    {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        location: 'Seattle, WA',
        experience: 5,
        education: "Master's in SE",
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
        matchedSkills: ['React', 'TypeScript'],
        skillMatch: 85,
        rank: 2,
        status: 'reviewed',
        summary: 'Full-stack developer.',
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected for seeding');
        await Job.deleteMany({});
        await Candidate.deleteMany({});

        await Job.insertMany(jobsData);
        await Candidate.insertMany(candidatesData);

        console.log('Data seeded');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        mongoose.connection.close();
    });
