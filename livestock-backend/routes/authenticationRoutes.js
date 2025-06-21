//livestock-backend/routes/authenticationRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authenticationController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
