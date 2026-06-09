const app = require('../backend/server.js');
const express = require('express');
const path = require('path');

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to dashboard for SPA routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

module.exports = app;
