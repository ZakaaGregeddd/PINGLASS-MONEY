const app = require('../backend/server.js');
const express = require('express');
const path = require('path');

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve specific static files
app.get('/:file', (req, res) => {
  const filePath = path.join(__dirname, '../frontend', req.params.file);
  res.sendFile(filePath, (err) => {
    if (err) {
      // If file not found, try serving dashboard.html for SPA routing
      res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
    }
  });
});

// Fallback to dashboard for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

module.exports = app;
