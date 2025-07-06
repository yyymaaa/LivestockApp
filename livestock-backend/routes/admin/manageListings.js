const express = require('express');
const router = express.Router();
const { getListings, deleteListing } = require('../../controllers/admin/manageListings');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { requireAdmin } = require('../../middleware/roleMiddleware');

// Paginated listings
router.get('/', authenticateToken, requireAdmin, getListings);

// Delete listing
router.delete('/:listingId', authenticateToken, requireAdmin, deleteListing);

module.exports = router;
