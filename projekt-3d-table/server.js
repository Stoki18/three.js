// Require the express module
const express = require('express');

// Require the path module
const path = require('path');

// Create an Express application
const app = express();

// Define the port
const PORT = 3000;

// Use express.static middleware to serve files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server and listen on the defined port
app.listen(PORT, () => {
  // Log a message to the console indicating that the server is running and on which port
  console.log(`Server is running on http://localhost:${PORT}`);
});
