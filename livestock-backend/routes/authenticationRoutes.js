const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authenticationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Authenticated user', user: req.user });
});

module.exports = router;
