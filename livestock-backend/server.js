//livestock-backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(' Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const uploadRoute = require('./routes/upload');

// Route imports
let farmerServices, myListings, searchListings, profile;
let serviceProviderProfile, serviceProviderlistings;
let productBuyerProducts, productBuyerSearch, productBuyerProfile;

try {
  // Farmer
  farmerServices = require('./routes/farmer/servicelistings');
  myListings = require('./routes/farmer/mylistings');
  searchListings = require('./routes/farmer/searchlistings');
  profile = require('./routes/farmer/profile');

  // Service Provider
  serviceProviderProfile = require('./routes/serviceprovider/profile');
  serviceProviderlistings = require('./routes/serviceprovider/mylistings');

  // Product Buyer
  productBuyerProducts = require('./routes/productbuyer/productlistings');
  productBuyerSearch = require('./routes/productbuyer/search');
  productBuyerProfile = require('./routes/productbuyer/profile');
} catch (err) {
  console.error('\nRoute import error:\n', err);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Farmer Routes
app.use('/api/farmer/services', farmerServices);
app.use('/api/farmer/mylistings', myListings);
app.use('/api/farmer/searchlistings', searchListings);
app.use('/api/farmer/profile', profile);

// Service Provider Routes
app.use('/api/serviceprovider/profile', serviceProviderProfile);
app.use('/api/serviceprovider/mylistings', serviceProviderlistings);

// Product Buyer Routes
app.use('/api/productbuyer/products', productBuyerProducts);
app.use('/api/productbuyer/search', productBuyerSearch);
app.use('/api/productbuyer/profile', productBuyerProfile);

// Other Routes
app.use('/api/auth', require('./routes/authenticationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', uploadRoute);

// Health check
app.get('/', (req, res) => {
  res.send('Livestock API server is running.');
});

// 404 handler (keep this one only)
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(' Global error handler caught:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
console.log('✅ Server setup complete. Ready to accept requests.');
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
