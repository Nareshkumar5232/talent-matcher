const API_URL = import.meta.env.VITE_API_URL || '/api';

const mapId = (item: any) => ({ ...item, id: item._id || item.id });

export const getJobs = async () => {
    const res = await fetch(`${API_URL}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    const data = await res.json();
    return data.map(mapId);
};

export const createJob = async (job: any) => {
    const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return mapId(await res.json());
};

export const updateJob = async (id: string, job: any) => {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error('Failed to update job');
    return mapId(await res.json());
};

export const deleteJob = async (id: string) => {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete job');
    return res.json();
};

export const getCandidates = async () => {
    const res = await fetch(`${API_URL}/candidates`);
    if (!res.ok) throw new Error('Failed to fetch candidates');
    const data = await res.json();
    return data.map(mapId);
};

export const createCandidate = async (candidate: any) => {
    const res = await fetch(`${API_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
    });
    if (!res.ok) throw new Error('Failed to create candidate');
    return mapId(await res.json());
};

export const updateCandidate = async (id: string, candidate: any) => {
    const res = await fetch(`${API_URL}/candidates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
    });
    if (!res.ok) throw new Error('Failed to update candidate');
    return mapId(await res.json());
};

export const deleteCandidate = async (id: string) => {
    const res = await fetch(`${API_URL}/candidates/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete candidate');
    return res.json();
};

export const getDashboardStats = async () => {
    const res = await fetch(`${API_URL}/stats/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
};

export const getActivityStats = async () => {
    const res = await fetch(`${API_URL}/stats/activity`);
    if (!res.ok) throw new Error('Failed to fetch activity stats');
    return res.json();
};

export const getSkillsStats = async () => {
    const res = await fetch(`${API_URL}/stats/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills stats');
    return res.json();
};

export const uploadResume = async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload resume');
    }
    return res.json();
};
