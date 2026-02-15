const { getFirestore, COLLECTIONS } = require('../config/firebase.cjs');

/**
 * Job Service - Firestore operations for jobs
 * Replaces the Mongoose Job model
 */
class JobService {
    constructor() {
        this.collectionName = COLLECTIONS.JOBS;
    }

    get collection() {
        return getFirestore().collection(this.collectionName);
    }

    /**
     * Get all jobs
     */
    async findAll() {
        const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        }));
    }

    /**
     * Alias for findAll (Mongoose compatibility)
     */
    async find() {
        return this.findAll();
    }

    /**
     * Find job by ID
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
     * Create a new job
     */
    async create(data) {
        const jobData = {
            title: data.title || '',
            department: data.department || '',
            location: data.location || '',
            requiredSkills: data.requiredSkills || [],
            preferredSkills: data.preferredSkills || [],
            experience: data.experience || { min: 0, max: 0 },
            education: data.education || '',
            description: data.description || '',
            createdAt: data.createdAt || new Date(),
            status: data.status || 'active',
            candidateCount: data.candidateCount || 0,
            updatedAt: new Date()
        };

        const docRef = await this.collection.add(jobData);
        return {
            _id: docRef.id,
            id: docRef.id,
            ...jobData
        };
    }

    /**
     * Save method for Mongoose compatibility
     */
    async save(data) {
        return this.create(data);
    }

    /**
     * Update a job by ID
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
     * Delete a job by ID
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
     * Count all documents
     */
    async countDocuments() {
        const snapshot = await this.collection.get();
        return snapshot.size;
    }
}

module.exports = new JobService();
