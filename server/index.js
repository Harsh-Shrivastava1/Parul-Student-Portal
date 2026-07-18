const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const seedDatabase = require('./seed/seed');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const studentRoutes = require('./routes/students');
const cellRoutes = require('./routes/cells');
const internshipRoutes = require('./routes/internships');
const applicationRoutes = require('./routes/applications');
const notificationRoutes = require('./routes/notifications');
const emailLogRoutes = require('./routes/emailLogs');
const authRoutes = require('./routes/auth');
const trainingRoutes = require('./routes/trainings');
const attendanceRoutes = require('./routes/attendance');
const feedbackRoutes = require('./routes/feedbacks');
const compatibilityRoutes = require('./routes/compatibility');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/students', studentRoutes);
app.use('/api/cells', cellRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/email-logs', emailLogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api', compatibilityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Parul Internship API is running', db: 'parul_internship_system' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

// Central error handler
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
    console.log(`📡  API base: http://localhost:${PORT}/api`);
  });
};

start();
