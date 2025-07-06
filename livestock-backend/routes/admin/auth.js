const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/adminAuth');

router.post('/login', adminAuthController.adminLogin);

module.exports = router;
