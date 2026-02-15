const { getFirestore, COLLECTIONS } = require('../config/firebase.cjs');

/**
 * Candidate Service - Firestore operations for candidates
 * Replaces the Mongoose Candidate model
 */
class CandidateService {
    constructor() {
        this.collectionName = COLLECTIONS.CANDIDATES;
    }

    get collection() {
        return getFirestore().collection(this.collectionName);
    }

    /**
     * Get all candidates
     */
    async findAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        }));
    }

    /**
     * Find candidate by ID
     */
    async findById(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return {
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        };
    }

    /**
     * Create a new candidate
     */
    async create(data) {
        const candidateData = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            experience: data.experience || 0,
            education: data.education || '',
            skills: data.skills || [],
            matchedSkills: data.matchedSkills || [],
            missingSkills: data.missingSkills || [],
            skillMatch: data.skillMatch || 0,
            experienceMatch: data.experienceMatch || 0,
            educationMatch: data.educationMatch || 0,
            overallScore: data.overallScore || 0,
            rank: data.rank || 0,
            resumeUrl: data.resumeUrl || '',
            appliedDate: data.appliedDate || new Date(),
            status: data.status || 'new',
            summary: data.summary || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await this.collection.add(candidateData);
        return {
            _id: docRef.id,
            id: docRef.id,
            ...candidateData
        };
    }

    /**
     * Update a candidate by ID
     */
    async findByIdAndUpdate(id, data) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return null;
        }

        const updateData = {
            ...data,
            updatedAt: new Date()
        };

        await docRef.update(updateData);
        
        const updatedDoc = await docRef.get();
        return {
            _id: updatedDoc.id,
            id: updatedDoc.id,
            ...updatedDoc.data()
        };
    }

    /**
     * Delete a candidate by ID
     */
    async findByIdAndDelete(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        await docRef.delete();
        
        return {
            _id: id,
            id: id,
            ...data
        };
    }

    /**
     * Count documents matching a query
     */
    async countDocuments(query = {}) {
        let ref = this.collection;

        // Handle status queries
        if (query.status) {
            if (query.status.$in) {
                // For $in queries, we need to do multiple queries or filter in memory
                const snapshot = await ref.get();
                return snapshot.docs.filter(doc => 
                    query.status.$in.includes(doc.data().status)
                ).length;
            } else {
                ref = ref.where('status', '==', query.status);
            }
        }

        // Handle date queries
        if (query.appliedDate) {
            if (query.appliedDate.$gte) {
                ref = ref.where('appliedDate', '>=', query.appliedDate.$gte);
            }
            if (query.appliedDate.$lt) {
                ref = ref.where('appliedDate', '<', query.appliedDate.$lt);
            }
        }

        const snapshot = await ref.get();
        return snapshot.size;
    }

    /**
     * Aggregate operations (simplified for Firestore)
     */
    async aggregate(pipeline) {
        // Handle average calculation for skillMatch
        const snapshot = await this.collection.get();
        const docs = snapshot.docs.map(doc => doc.data());
        
        if (docs.length === 0) {
            return [];
        }

        // Calculate average skillMatch
        const avgSkillMatch = docs.reduce((sum, doc) => sum + (doc.skillMatch || 0), 0) / docs.length;
        
        return [{ avgSkillMatch }];
    }

    /**
     * Find with query (simplified)
     */
    async find(query = {}) {
        const snapshot = await this.collection.get();
        let results = snapshot.docs.map(doc => ({
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        }));

        // Apply filters in memory for complex queries
        if (query.status) {
            if (query.status.$in) {
                results = results.filter(doc => query.status.$in.includes(doc.status));
            } else {
                results = results.filter(doc => doc.status === query.status);
            }
        }

        return results;
    }
}

module.exports = new CandidateService();
