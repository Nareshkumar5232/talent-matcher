import {
    jobDescriptions as mockJobs,
    candidates as mockCandidates,
    dashboardStats as mockDashboardStats,
    recentActivity as mockActivity,
    processingActivityData as mockProcessingActivity,
    skillGapData as mockSkillGap,
    matchDistributionData as mockMatchDistribution,
    topMatchedSkillsData as mockTopSkills
} from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const mapId = (item: any) => ({ ...item, id: item._id || item.id });

// Helper to delay mock response
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getJobs = async () => {
    try {
        const res = await fetch(`${API_URL}/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        return data.map(mapId);
    } catch (error) {
        console.warn('API fetch failed, falling back to mock data:', error);
        await delay(500);
        return mockJobs;
    }
};

export const createJob = async (job: any) => {
    try {
        const res = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(job),
        });
        if (!res.ok) throw new Error('Failed to create job');
        return mapId(await res.json());
    } catch (error) {
        console.warn('API create failed, using mock:', error);
        await delay(500);
        // Return mock created job 
        return { ...job, id: `mock-job-${Date.now()}`, status: 'active', createdAt: new Date().toISOString() };
    }
};

export const updateJob = async (id: string, job: any) => {
    try {
        const res = await fetch(`${API_URL}/jobs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(job),
        });
        if (!res.ok) throw new Error('Failed to update job');
        return mapId(await res.json());
    } catch (error) {
        console.warn('API update failed, using mock:', error);
        await delay(500);
        return { ...job, id };
    }
};

export const deleteJob = async (id: string) => {
    try {
        const res = await fetch(`${API_URL}/jobs/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete job');
        return res.json();
    } catch (error) {
        console.warn('API delete failed, using mock:', error);
        await delay(500);
        return { message: 'Job deleted (mock)' };
    }
};

export const getCandidates = async () => {
    try {
        const res = await fetch(`${API_URL}/candidates`);
        if (!res.ok) throw new Error('Failed to fetch candidates');
        const data = await res.json();
        return data.map(mapId);
    } catch (error) {
        console.warn('API fetch failed, falling back to mock data:', error);
        await delay(500);
        return mockCandidates;
    }
};

export const createCandidate = async (candidate: any) => {
    try {
        const res = await fetch(`${API_URL}/candidates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidate),
        });
        if (!res.ok) throw new Error('Failed to create candidate');
        return mapId(await res.json());
    } catch (error) {
        console.warn('API create failed, using mock:', error);
        await delay(500);
        return { ...candidate, id: `mock-cand-${Date.now()}`, status: 'new' };
    }
};

export const updateCandidate = async (id: string, candidate: any) => {
    try {
        const res = await fetch(`${API_URL}/candidates/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidate),
        });
        if (!res.ok) throw new Error('Failed to update candidate');
        return mapId(await res.json());
    } catch (error) {
        console.warn('API update failed, using mock:', error);
        await delay(500);
        return { ...candidate, id };
    }
};

export const deleteCandidate = async (id: string) => {
    try {
        const res = await fetch(`${API_URL}/candidates/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete candidate');
        return res.json();
    } catch (error) {
        console.warn('API delete failed, using mock:', error);
        await delay(500);
        return { message: 'Candidate deleted (mock)' };
    }
};

export const getDashboardStats = async () => {
    try {
        const res = await fetch(`${API_URL}/stats/dashboard`);
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return res.json();
    } catch (error) {
        console.warn('API fetch failed, falling back to mock data:', error);
        await delay(500);
        return mockDashboardStats;
    }
};

export const getActivityStats = async () => {
    try {
        const res = await fetch(`${API_URL}/stats/activity`);
        if (!res.ok) throw new Error('Failed to fetch activity stats');
        return res.json();
    } catch (error) {
        console.warn('API fetch failed, falling back to mock data:', error);
        await delay(500);
        return {
            processingActivityData: mockProcessingActivity,
            recentActivity: mockActivity
        };
    }
};

export const getSkillsStats = async () => {
    try {
        const res = await fetch(`${API_URL}/stats/skills`);
        if (!res.ok) throw new Error('Failed to fetch skills stats');
        return res.json();
    } catch (error) {
        console.warn('API fetch failed, falling back to mock data:', error);
        await delay(500);
        return {
            skillGapData: mockSkillGap,
            matchDistributionData: mockMatchDistribution,
            topMatchedSkillsData: mockTopSkills
        };
    }
};

export const uploadResume = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('resume', file);

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload resume');
        return res.json();
    } catch (error) {
        console.warn('API upload failed, using mock:', error);
        await delay(1000);
        // Return mock parsed candidate
        return {
            message: 'Resume uploaded (mock)',
            candidate: {
                id: `mock-cand-${Date.now()}`,
                name: 'Mock Candidate',
                email: 'mock@example.com',
                skills: ['React', 'JavaScript', 'HTML', 'CSS'],
                experience: 5
            }
        };
    }
};
