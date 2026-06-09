const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

// Import backend routes
const authMiddleware = require('../backend/middleware/auth');
const authRoutes = require('../backend/routes/auth');
const transactionRoutes = require('../backend/routes/transactions');
const categoryRoutes = require('../backend/routes/categories');
const budgetRoutes = require('../backend/routes/budgets');
const reportRoutes = require('../backend/routes/reports');

// Health checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'FinGlass API running!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/budgets', authMiddleware, budgetRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA fallback
app.get('*', (req, res) => {
  const file = path.join(__dirname, '../frontend/dashboard.html');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: { message: err.message || 'Internal Server Error', status: err.status || 500 }
  });
});

module.exports = app;
