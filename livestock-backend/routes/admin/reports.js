const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/admin/adminReport');
const { authenticateToken, requireAdmin } = require('../../middleware/authMiddleware');

// GET all reports
router.get('/', authenticateToken, requireAdmin, reportController.getReports);

// POST a new report
router.post('/', authenticateToken, requireAdmin, reportController.createReport);

module.exports = router;
