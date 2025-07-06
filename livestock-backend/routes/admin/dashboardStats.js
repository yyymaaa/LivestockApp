const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../../controllers/admin/dashboardStats');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { requireAdmin } = require('../../middleware/roleMiddleware');
const db = require('../../config/db')

router.get('/', authenticateToken, requireAdmin, getDashboardStats);

module.exports = router;
