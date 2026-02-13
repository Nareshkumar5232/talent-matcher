require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Routes
const jobsRouter = require('./routes/jobs.cjs');
const candidatesRouter = require('./routes/candidates.cjs');
const statsRouter = require('./routes/stats.cjs');
const uploadRouter = require('./routes/upload.cjs');

app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
