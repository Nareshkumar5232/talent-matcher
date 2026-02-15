/**
 * Firebase Seed Script
 * Run this to populate Firestore with demo data
 * Usage: node seed-firebase.js
 */

require('dotenv').config();
const { initializeFirebase, getFirestore, COLLECTIONS } = require('./config/firebase.cjs');

// Demo data
const candidatesData = [
    {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '555-0101',
        location: 'San Francisco, CA',
        experience: 5,
        education: 'BS Computer Science',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'GraphQL'],
        matchedSkills: ['React', 'Node.js', 'TypeScript'],
        missingSkills: ['Python'],
        status: 'shortlisted',
        skillMatch: 92,
        experienceMatch: 95,
        educationMatch: 100,
        overallScore: 88,
        rank: 1,
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        summary: 'Senior full-stack developer with 5 years of experience in React and Node.js ecosystems.'
    },
    {
        name: 'Michael Chen',
        email: 'm.chen@example.com',
        phone: '555-0102',
        location: 'Seattle, WA',
        experience: 3,
        education: 'MS Software Engineering',
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
        matchedSkills: ['Python', 'AWS'],
        missingSkills: ['React', 'Node.js'],
        status: 'reviewed',
        skillMatch: 78,
        experienceMatch: 80,
        educationMatch: 100,
        overallScore: 82,
        rank: 2,
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        summary: 'Backend developer specializing in Python and cloud infrastructure.'
    },
    {
        name: 'Emily Rodriguez',
        email: 'emily.r@example.com',
        phone: '555-0103',
        location: 'Austin, TX',
        experience: 4,
        education: 'BS Information Technology',
        skills: ['JavaScript', 'Vue.js', 'Node.js', 'MySQL', 'Redis'],
        matchedSkills: ['JavaScript', 'Node.js'],
        missingSkills: ['React', 'TypeScript'],
        status: 'new',
        skillMatch: 75,
        experienceMatch: 85,
        educationMatch: 90,
        overallScore: 78,
        rank: 3,
        appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        summary: 'Full-stack developer with experience in Vue.js and Node.js applications.'
    },
    {
        name: 'David Kim',
        email: 'd.kim@example.com',
        phone: '555-0104',
        location: 'New York, NY',
        experience: 7,
        education: 'PhD Computer Science',
        skills: ['Java', 'Spring Boot', 'Kubernetes', 'React', 'TypeScript'],
        matchedSkills: ['React', 'TypeScript', 'Java'],
        missingSkills: [],
        status: 'shortlisted',
        skillMatch: 95,
        experienceMatch: 100,
        educationMatch: 100,
        overallScore: 96,
        rank: 1,
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        summary: 'Senior architect with expertise in enterprise Java and modern frontend frameworks.'
    },
    {
        name: 'Jessica Martinez',
        email: 'j.martinez@example.com',
        phone: '555-0105',
        location: 'Denver, CO',
        experience: 2,
        education: 'BS Computer Science',
        skills: ['React', 'JavaScript', 'CSS', 'Figma', 'HTML'],
        matchedSkills: ['React', 'JavaScript'],
        missingSkills: ['Node.js', 'TypeScript'],
        status: 'new',
        skillMatch: 68,
        experienceMatch: 60,
        educationMatch: 100,
        overallScore: 70,
        rank: 5,
        appliedDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
        summary: 'Frontend developer with strong design skills and React experience.'
    },
    {
        name: 'Robert Thompson',
        email: 'r.thompson@example.com',
        phone: '555-0106',
        location: 'Chicago, IL',
        experience: 6,
        education: 'MS Computer Science',
        skills: ['Go', 'Rust', 'PostgreSQL', 'Kafka', 'gRPC'],
        matchedSkills: ['PostgreSQL'],
        missingSkills: ['React', 'Node.js', 'TypeScript'],
        status: 'rejected',
        skillMatch: 45,
        experienceMatch: 90,
        educationMatch: 100,
        overallScore: 55,
        rank: 6,
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        summary: 'Systems programmer with expertise in Go and Rust for high-performance applications.'
    }
];

const jobsData = [
    {
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        preferredSkills: ['GraphQL', 'AWS', 'Docker'],
        experience: { min: 4, max: 8 },
        education: 'Bachelor\'s degree in Computer Science or related field',
        description: 'We are looking for a Senior Full Stack Developer to join our engineering team. You will be responsible for building and maintaining web applications using React and Node.js.',
        status: 'active',
        candidateCount: 4,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Backend Engineer',
        department: 'Engineering',
        location: 'Remote',
        requiredSkills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
        preferredSkills: ['Docker', 'Kubernetes', 'AWS'],
        experience: { min: 2, max: 5 },
        education: 'Bachelor\'s degree in Computer Science',
        description: 'Join our backend team to build scalable APIs and services using Python and Django.',
        status: 'active',
        candidateCount: 2,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Frontend Developer',
        department: 'Product',
        location: 'New York, NY',
        requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML'],
        preferredSkills: ['TypeScript', 'Next.js', 'Tailwind CSS'],
        experience: { min: 1, max: 3 },
        education: 'Bachelor\'s degree or equivalent experience',
        description: 'We are seeking a talented Frontend Developer to create beautiful and responsive user interfaces.',
        status: 'active',
        candidateCount: 3,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
];

const activitiesData = [
    {
        type: 'upload',
        candidateName: 'Sarah Johnson',
        jobTitle: 'Senior Full Stack Developer',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        user: 'HR Admin'
    },
    {
        type: 'review',
        candidateName: 'Michael Chen',
        jobTitle: 'Backend Engineer',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        user: 'HR Admin'
    },
    {
        type: 'shortlist',
        candidateName: 'Sarah Johnson',
        jobTitle: 'Senior Full Stack Developer',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: 'HR Admin'
    },
    {
        type: 'upload',
        candidateName: 'Emily Rodriguez',
        jobTitle: 'Frontend Developer',
        timestamp: new Date(Date.now() - 0.8 * 24 * 60 * 60 * 1000),
        user: 'HR Admin'
    },
    {
        type: 'shortlist',
        candidateName: 'David Kim',
        jobTitle: 'Senior Full Stack Developer',
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
        user: 'HR Admin'
    },
    {
        type: 'reject',
        candidateName: 'Robert Thompson',
        jobTitle: 'Senior Full Stack Developer',
        timestamp: new Date(Date.now() - 0.3 * 24 * 60 * 60 * 1000),
        user: 'HR Admin'
    },
    {
        type: 'upload',
        candidateName: 'Jessica Martinez',
        jobTitle: 'Frontend Developer',
        timestamp: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000),
        user: 'HR Admin'
    }
];

async function seedDatabase() {
    try {
        console.log('Initializing Firebase...');
        initializeFirebase();
        const db = getFirestore();

        console.log('\n--- Clearing existing data ---');
        
        // Clear existing collections
        const collections = [COLLECTIONS.CANDIDATES, COLLECTIONS.JOBS, COLLECTIONS.ACTIVITIES];
        for (const collectionName of collections) {
            const snapshot = await db.collection(collectionName).get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log(`Cleared ${collectionName}: ${snapshot.size} documents deleted`);
        }

        console.log('\n--- Seeding Candidates ---');
        for (const candidate of candidatesData) {
            const docRef = await db.collection(COLLECTIONS.CANDIDATES).add({
                ...candidate,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`Added candidate: ${candidate.name} (${docRef.id})`);
        }

        console.log('\n--- Seeding Jobs ---');
        for (const job of jobsData) {
            const docRef = await db.collection(COLLECTIONS.JOBS).add({
                ...job,
                updatedAt: new Date()
            });
            console.log(`Added job: ${job.title} (${docRef.id})`);
        }

        console.log('\n--- Seeding Activities ---');
        for (const activity of activitiesData) {
            const docRef = await db.collection(COLLECTIONS.ACTIVITIES).add(activity);
            console.log(`Added activity: ${activity.type} - ${activity.candidateName}`);
        }

        console.log('\n✅ Database seeded successfully!');
        console.log(`   Candidates: ${candidatesData.length}`);
        console.log(`   Jobs: ${jobsData.length}`);
        console.log(`   Activities: ${activitiesData.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
