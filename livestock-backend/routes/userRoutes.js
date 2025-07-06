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
        const [user] = await db.query('SELECT * FROM user');
        console.log(user);
        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'No user found' });
        }
        res.json(user); 
    } 
        catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Server error' });
        }
});


module.exports = router;
