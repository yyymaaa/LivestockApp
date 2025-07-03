const express = require('express');
const router = express.Router();
const db = require('../config/db.js'); 
const {
  getAuthenticatedUser,
  checkUsernameAvailability,
  saveUsername,
  saveLocation,
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/user-details', authenticateToken, getAuthenticatedUser);
router.get('/check-username/:username', checkUsernameAvailability);

router.post('/save-username', authenticateToken, saveUsername);
router.post('/save-location', authenticateToken, saveLocation);

router.get('/', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        console.log(users);
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json(users); 
    } 
        catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Server error' });
        }
});


module.exports = router;
