const express = require('express');
const router = express.Router();
const {
  checkUsernameAvailability,
  saveUsername,
  saveLocation,
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/authMiddleware');

// Public
router.get('/check-username/:username', checkUsernameAvailability);

// Protected
router.post('/save-username', authenticateToken, saveUsername);
router.post('/save-location', authenticateToken, saveLocation);

module.exports = router;
