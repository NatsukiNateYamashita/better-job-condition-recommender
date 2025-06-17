// app.js - Main application file
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Sample API endpoint
app.get('/api/info', (req, res) => {
  res.json({
    message: 'Hello from Azure!',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Catch-all route to serve the main page
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});