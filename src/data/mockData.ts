// Mock data for HR Resume Ranking Dashboard

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  education: string;
  skills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  overallScore: number;
  rank: number;
  resumeUrl: string;
  appliedDate: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  summary: string;
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  location: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: { min: number; max: number };
  education: string;
  description: string;
  createdAt: string;
  status: 'active' | 'closed' | 'draft';
  candidateCount: number;
}

export interface DashboardStats {
  totalCandidates: number;
  resumesProcessed: number;
  shortlistedCandidates: number;
  averageSkillMatch: number;
  weeklyChange: {
    candidates: number;
    processed: number;
    shortlisted: number;
    skillMatch: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'upload' | 'shortlist' | 'reject' | 'review' | 'create' | 'update' | 'delete';
  candidateName: string;
  jobTitle: string;
  timestamp: string;
  user: string;
}

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
  totalCandidates: 1247,
  resumesProcessed: 892,
  shortlistedCandidates: 156,
  averageSkillMatch: 73,
  weeklyChange: {
    candidates: 12,
    processed: 8,
    shortlisted: 23,
    skillMatch: 2,
  },
};

// Recent Activity
export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'upload',
    candidateName: 'Sarah Johnson',
    jobTitle: 'Senior Frontend Developer',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'HR Admin',
  },
  {
    id: '2',
    type: 'shortlist',
    candidateName: 'Michael Chen',
    jobTitle: 'Full Stack Engineer',
    timestamp: '2024-01-15T09:45:00Z',
    user: 'John Smith',
  },
  {
    id: '3',
    type: 'review',
    candidateName: 'Emily Davis',
    jobTitle: 'Product Manager',
    timestamp: '2024-01-15T09:15:00Z',
    user: 'Jane Doe',
  },
  {
    id: '4',
    type: 'reject',
    candidateName: 'Robert Wilson',
    jobTitle: 'Data Scientist',
    timestamp: '2024-01-14T16:30:00Z',
    user: 'HR Admin',
  },
  {
    id: '5',
    type: 'upload',
    candidateName: 'Lisa Anderson',
    jobTitle: 'UX Designer',
    timestamp: '2024-01-14T14:20:00Z',
    user: 'HR Admin',
  },
];

// Job Descriptions
export const jobDescriptions: JobDescription[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    preferredSkills: ['Next.js', 'GraphQL', 'Testing', 'Node.js'],
    experience: { min: 5, max: 8 },
    education: "Bachelor's in Computer Science",
    description: 'We are looking for a Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining our web applications using modern technologies.',
    createdAt: '2024-01-10T00:00:00Z',
    status: 'active',
    candidateCount: 45,
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    department: 'Engineering',
    location: 'New York, NY',
    requiredSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    preferredSkills: ['Kubernetes', 'Redis', 'GraphQL', 'TypeScript'],
    experience: { min: 3, max: 6 },
    education: "Bachelor's in Computer Science or related field",
    description: 'Join our team as a Full Stack Engineer to build scalable applications from front to back.',
    createdAt: '2024-01-08T00:00:00Z',
    status: 'active',
    candidateCount: 78,
  },
  {
    id: 'job-3',
    title: 'Data Scientist',
    department: 'Data',
    location: 'Remote',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    preferredSkills: ['PyTorch', 'Spark', 'NLP', 'Computer Vision'],
    experience: { min: 4, max: 7 },
    education: "Master's in Data Science, Statistics, or related field",
    description: 'We need a Data Scientist to help us extract insights from our data and build predictive models.',
    createdAt: '2024-01-05T00:00:00Z',
    status: 'active',
    candidateCount: 62,
  },
  {
    id: 'job-4',
    title: 'Product Manager',
    department: 'Product',
    location: 'Austin, TX',
    requiredSkills: ['Product Strategy', 'Roadmapping', 'User Research', 'Agile', 'Analytics'],
    preferredSkills: ['SQL', 'Figma', 'A/B Testing', 'Technical Background'],
    experience: { min: 5, max: 10 },
    education: "Bachelor's degree required, MBA preferred",
    description: 'Lead product development initiatives and work closely with engineering and design teams.',
    createdAt: '2024-01-03T00:00:00Z',
    status: 'active',
    candidateCount: 34,
  },
  {
    id: 'job-5',
    title: 'UX Designer',
    department: 'Design',
    location: 'Seattle, WA',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Wireframing'],
    preferredSkills: ['HTML/CSS', 'Animation', 'Accessibility', 'Illustration'],
    experience: { min: 3, max: 5 },
    education: "Bachelor's in Design, HCI, or related field",
    description: 'Create intuitive and beautiful user experiences for our products.',
    createdAt: '2024-01-01T00:00:00Z',
    status: 'closed',
    candidateCount: 29,
  },
];

// Candidates
export const candidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    experience: 6,
    education: "Bachelor's in Computer Science, Stanford University",
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Next.js', 'GraphQL', 'Node.js', 'Testing'],
    matchedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Next.js', 'GraphQL'],
    missingSkills: [],
    skillMatch: 95,
    experienceMatch: 100,
    educationMatch: 100,
    overallScore: 98,
    rank: 1,
    resumeUrl: '/resumes/sarah-johnson.pdf',
    appliedDate: '2024-01-14T00:00:00Z',
    status: 'shortlisted',
    summary: 'Experienced frontend developer with 6 years of expertise in React ecosystem. Led development of multiple high-traffic web applications. Strong background in performance optimization and accessibility.',
  },
  {
    id: 'cand-2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'Seattle, WA',
    experience: 5,
    education: "Master's in Software Engineering, MIT",
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Vue.js', 'Node.js', 'Python'],
    matchedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
    missingSkills: ['HTML'],
    skillMatch: 85,
    experienceMatch: 100,
    educationMatch: 100,
    overallScore: 92,
    rank: 2,
    resumeUrl: '/resumes/michael-chen.pdf',
    appliedDate: '2024-01-13T00:00:00Z',
    status: 'reviewed',
    summary: 'Full-stack developer with strong frontend focus. Built enterprise applications at scale. Passionate about clean code and best practices.',
  },
  {
    id: 'cand-3',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 345-6789',
    location: 'New York, NY',
    experience: 4,
    education: "Bachelor's in Computer Science, Columbia University",
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Jest', 'Cypress'],
    matchedSkills: ['React', 'JavaScript', 'CSS', 'HTML', 'Testing'],
    missingSkills: ['TypeScript', 'GraphQL'],
    skillMatch: 72,
    experienceMatch: 80,
    educationMatch: 100,
    overallScore: 78,
    rank: 3,
    resumeUrl: '/resumes/emily-davis.pdf',
    appliedDate: '2024-01-12T00:00:00Z',
    status: 'reviewed',
    summary: 'Frontend developer with focus on testing and quality. Strong understanding of React patterns and state management.',
  },
  {
    id: 'cand-4',
    name: 'David Park',
    email: 'david.park@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    experience: 7,
    education: "Bachelor's in Information Technology",
    skills: ['React', 'TypeScript', 'JavaScript', 'Angular', 'CSS', 'HTML', 'AWS'],
    matchedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    missingSkills: ['Next.js', 'GraphQL'],
    skillMatch: 78,
    experienceMatch: 90,
    educationMatch: 85,
    overallScore: 82,
    rank: 4,
    resumeUrl: '/resumes/david-park.pdf',
    appliedDate: '2024-01-11T00:00:00Z',
    status: 'new',
    summary: 'Versatile developer with experience in multiple frameworks. Strong cloud and DevOps background.',
  },
  {
    id: 'cand-5',
    name: 'Jessica Martinez',
    email: 'jessica.m@email.com',
    phone: '+1 (555) 567-8901',
    location: 'Denver, CO',
    experience: 3,
    education: "Bachelor's in Computer Science",
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'jQuery'],
    matchedSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
    missingSkills: ['TypeScript', 'Next.js', 'GraphQL', 'Testing'],
    skillMatch: 58,
    experienceMatch: 60,
    educationMatch: 100,
    overallScore: 65,
    rank: 5,
    resumeUrl: '/resumes/jessica-martinez.pdf',
    appliedDate: '2024-01-10T00:00:00Z',
    status: 'new',
    summary: 'Junior developer with solid fundamentals. Eager to learn and grow in a collaborative environment.',
  },
  {
    id: 'cand-6',
    name: 'Alex Thompson',
    email: 'alex.t@email.com',
    phone: '+1 (555) 678-9012',
    location: 'Portland, OR',
    experience: 8,
    education: "Master's in Computer Science, UC Berkeley",
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Next.js', 'GraphQL', 'Node.js', 'PostgreSQL', 'Docker'],
    matchedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Next.js', 'GraphQL', 'Node.js', 'Testing'],
    missingSkills: [],
    skillMatch: 100,
    experienceMatch: 95,
    educationMatch: 100,
    overallScore: 98,
    rank: 1,
    resumeUrl: '/resumes/alex-thompson.pdf',
    appliedDate: '2024-01-15T00:00:00Z',
    status: 'shortlisted',
    summary: 'Senior engineer with extensive full-stack experience. Led teams and architected large-scale applications.',
  },
  {
    id: 'cand-7',
    name: 'Rachel Kim',
    email: 'rachel.kim@email.com',
    phone: '+1 (555) 789-0123',
    location: 'Chicago, IL',
    experience: 5,
    education: "Bachelor's in Software Engineering",
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Webpack'],
    matchedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    missingSkills: ['Next.js', 'GraphQL'],
    skillMatch: 80,
    experienceMatch: 100,
    educationMatch: 90,
    overallScore: 85,
    rank: 3,
    resumeUrl: '/resumes/rachel-kim.pdf',
    appliedDate: '2024-01-09T00:00:00Z',
    status: 'reviewed',
    summary: 'Frontend specialist with deep knowledge of build tools and optimization. Experience with design systems.',
  },
  {
    id: 'cand-8',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1 (555) 890-1234',
    location: 'Boston, MA',
    experience: 2,
    education: "Bachelor's in Computer Science",
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Python'],
    matchedSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
    missingSkills: ['TypeScript', 'Next.js', 'GraphQL', 'Testing', 'Node.js'],
    skillMatch: 52,
    experienceMatch: 40,
    educationMatch: 100,
    overallScore: 55,
    rank: 8,
    resumeUrl: '/resumes/james-wilson.pdf',
    appliedDate: '2024-01-08T00:00:00Z',
    status: 'rejected',
    summary: 'Recent graduate with strong academic background. Looking for entry-level opportunities.',
  },
];

// Chart data for processing activity
export const processingActivityData = [
  { date: 'Jan 1', uploads: 12, processed: 10, shortlisted: 3 },
  { date: 'Jan 2', uploads: 18, processed: 15, shortlisted: 4 },
  { date: 'Jan 3', uploads: 24, processed: 22, shortlisted: 6 },
  { date: 'Jan 4', uploads: 15, processed: 14, shortlisted: 2 },
  { date: 'Jan 5', uploads: 31, processed: 28, shortlisted: 8 },
  { date: 'Jan 6', uploads: 22, processed: 20, shortlisted: 5 },
  { date: 'Jan 7', uploads: 8, processed: 8, shortlisted: 2 },
  { date: 'Jan 8', uploads: 28, processed: 25, shortlisted: 7 },
  { date: 'Jan 9', uploads: 35, processed: 32, shortlisted: 9 },
  { date: 'Jan 10', uploads: 42, processed: 38, shortlisted: 11 },
  { date: 'Jan 11', uploads: 29, processed: 27, shortlisted: 6 },
  { date: 'Jan 12', uploads: 38, processed: 35, shortlisted: 10 },
  { date: 'Jan 13', uploads: 25, processed: 23, shortlisted: 5 },
  { date: 'Jan 14', uploads: 45, processed: 42, shortlisted: 12 },
];

// Skill gap analysis data
export const skillGapData = [
  { skill: 'React', candidates: 45, matched: 42 },
  { skill: 'TypeScript', candidates: 45, matched: 35 },
  { skill: 'JavaScript', candidates: 45, matched: 44 },
  { skill: 'CSS', candidates: 45, matched: 43 },
  { skill: 'HTML', candidates: 45, matched: 44 },
  { skill: 'Next.js', candidates: 45, matched: 22 },
  { skill: 'GraphQL', candidates: 45, matched: 18 },
  { skill: 'Testing', candidates: 45, matched: 28 },
  { skill: 'Node.js', candidates: 45, matched: 30 },
];

// Match distribution data
export const matchDistributionData = [
  { range: '90-100%', count: 8, color: 'hsl(142, 76%, 36%)' },
  { range: '80-89%', count: 12, color: 'hsl(217, 91%, 60%)' },
  { range: '70-79%', count: 15, color: 'hsl(38, 92%, 50%)' },
  { range: '60-69%', count: 7, color: 'hsl(0, 72%, 51%)' },
  { range: '<60%', count: 3, color: 'hsl(0, 72%, 40%)' },
];

// Top matched skills
export const topMatchedSkillsData = [
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
