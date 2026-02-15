const { getFirestore, COLLECTIONS } = require('../config/firebase.cjs');

/**
 * Activity Service - Firestore operations for activities
 * Replaces the Mongoose Activity model
 */
class ActivityService {
    constructor() {
        this.collectionName = COLLECTIONS.ACTIVITIES;
    }

    get collection() {
        return getFirestore().collection(this.collectionName);
    }

    /**
     * Get all activities (sorted by timestamp descending)
     */
    async findAll() {
        const snapshot = await this.collection.orderBy('timestamp', 'desc').get();
        return snapshot.docs.map(doc => ({
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        }));
    }

    /**
     * Find activities with sorting and limiting
     */
    async find() {
        return {
            sort: (sortObj) => {
                return {
                    limit: async (limitNum) => {
                        let query = this.collection;
                        
                        // Handle sorting
                        for (const [field, order] of Object.entries(sortObj)) {
                            query = query.orderBy(field, order === -1 ? 'desc' : 'asc');
                        }
                        
                        query = query.limit(limitNum);
                        const snapshot = await query.get();
                        
                        return {
                            lean: () => snapshot.docs.map(doc => ({
                                _id: doc.id,
                                id: doc.id,
                                ...doc.data()
                            }))
                        };
                    }
                };
            }
        };
    }

    /**
     * Simplified find with options
     */
    async findWithOptions(options = {}) {
        let query = this.collection;

        // Apply ordering
        if (options.orderBy) {
            query = query.orderBy(options.orderBy.field, options.orderBy.direction || 'desc');
        } else {
            query = query.orderBy('timestamp', 'desc');
        }

        // Apply limit
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        }));
    }

    /**
     * Create a new activity
     */
    async create(data) {
        const activityData = {
            type: data.type || 'update',
            candidateName: data.candidateName || 'Unknown',
            jobTitle: data.jobTitle || 'General Application',
            timestamp: data.timestamp || new Date(),
            user: data.user || 'HR Admin',
            details: data.details || ''
        };

        const docRef = await this.collection.add(activityData);
        return {
            _id: docRef.id,
            id: docRef.id,
            ...activityData
        };
    }

    /**
     * Count documents matching a query
     */
    async countDocuments(query = {}) {
        const snapshot = await this.collection.get();
        let docs = snapshot.docs.map(doc => ({
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : new Date(doc.data().timestamp)
        }));

        // Filter by type
        if (query.type) {
            if (query.type.$in) {
                docs = docs.filter(doc => query.type.$in.includes(doc.type));
            } else {
                docs = docs.filter(doc => doc.type === query.type);
            }
        }

        // Filter by timestamp
        if (query.timestamp) {
            if (query.timestamp.$gte) {
                const gteDate = new Date(query.timestamp.$gte);
                docs = docs.filter(doc => new Date(doc.timestamp) >= gteDate);
            }
            if (query.timestamp.$lt) {
                const ltDate = new Date(query.timestamp.$lt);
                docs = docs.filter(doc => new Date(doc.timestamp) < ltDate);
            }
            if (query.timestamp.$lte) {
                const lteDate = new Date(query.timestamp.$lte);
                docs = docs.filter(doc => new Date(doc.timestamp) <= lteDate);
            }
        }

        return docs.length;
    }

    /**
     * Count activities by type within a date range
     */
    async countByTypeAndDateRange(type, startDate, endDate) {
        const snapshot = await this.collection.get();
        
        return snapshot.docs.filter(doc => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
            const matchesType = Array.isArray(type) ? type.includes(data.type) : data.type === type;
            const matchesDate = timestamp >= startDate && timestamp <= endDate;
            return matchesType && matchesDate;
        }).length;
    }
}

module.exports = new ActivityService();
