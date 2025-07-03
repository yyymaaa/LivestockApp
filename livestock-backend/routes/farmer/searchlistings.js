//livestock-backend/routes/farmer/searchlistings.js
const express = require('express');
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({
      error: 'Search query is required',
      example: 'Try searching for "tractor" or "plowing"'
    });
  }

  const searchTerm = `%${query.trim().toLowerCase()}%`;

  const sql = `
  SELECT 
    s.offering_id,
    s.title,
    s.description,
    s.price,
    s.status,
    s.created_at,
    u.name AS provider_name,
    lm.url AS image_url
  FROM service_listing s
  JOIN user u ON s.user_id = u.user_id
  LEFT JOIN listing_media lm ON s.offering_id = lm.service_listing_id
  WHERE (
    LOWER(s.title) LIKE ? OR 
    LOWER(s.description) LIKE ? OR 
    LOWER(u.name) LIKE ?
  ) AND s.status = 'available'
  ORDER BY s.created_at DESC
`;


  try {
    const [results] = await db.query(sql, [searchTerm, searchTerm, searchTerm]);
    const listings = results.map(item => ({
      ...item,
      image_url: item.image_url || null
    }));

    res.json(listings);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to search listings' });
  }
});

module.exports = router;
