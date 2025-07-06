const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../../controllers/admin/manage-users');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { requireAdmin } = require('../../middleware/roleMiddleware');

router.get('/', authenticateToken, requireAdmin, getUsers);

router.put('/role/:userId', authenticateToken, requireAdmin, updateUserRole);

module.exports = router;
