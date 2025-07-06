const express = require('express');
const router = express.Router();
const { banUser } = require('../../controllers/admin/banUsers');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { requireAdmin } = require('../../middleware/roleMiddleware');

router.put('/ban/:userId', authenticateToken, requireAdmin, banUser);

module.exports = router;
