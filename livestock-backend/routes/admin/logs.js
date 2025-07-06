const express = require('express');
const router = express.Router();
const { getAdminLogs } = require('../../controllers/admin/logController');
const { authenticateToken, requireAdmin } = require('../../middleware/authMiddleware');

router.get('/', authenticateToken, requireAdmin, getAdminLogs);

module.exports = router;
