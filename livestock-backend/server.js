//livestock-backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const farmerServices = require('./routes/farmer/servicelistings');
const myListings = require('./routes/farmer/mylistings');
const searchListings = require('./routes/farmer/searchlistings');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (add to her existing routes)
app.use('/api/farmer/services', farmerServices);
app.use('/api/farmer/mylistings', myListings);
app.use('/api/farmer/searchlistings', searchListings);

// Keep her auth/user routes
app.use('/api/auth', require('./routes/authenticationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('Livestock API server is running.');
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
