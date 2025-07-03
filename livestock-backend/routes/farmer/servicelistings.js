//livestock-backend/routes/farmer/servicelistings.js

const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Grouping logic
function groupMedia(results) {
  const grouped = {};
  results.forEach(row => {
    const {
      offering_id,
      title,
      description,
      price,
      available_slots,
      status,
      created_at,
      name,
      url,
    } = row;

    if (!grouped[offering_id]) {
      grouped[offering_id] = {
        offering_id,
        title,
        description,
        price,
        available_slots,
        status,
        created_at,
        provider_name: name,
        media: [],
      };
    }

    if (url && !grouped[offering_id].media.includes(url)) {
      grouped[offering_id].media.push(url);
    }
  });

  return Object.values(grouped);
}

// Route: GET /api/farmer/services
router.get('/', async (req, res) => {
  const query = `
    SELECT
      s.offering_id,
      s.title,
      s.description,
      s.price,
      s.available_slots,
      s.status,
      s.created_at,
      u.name,
      m.url
    FROM service_listing s
    JOIN user u ON s.user_id = u.user_id
    LEFT JOIN listing_media m ON s.offering_id = m.service_listing_id
    WHERE s.status = 'available'
    ORDER BY s.created_at DESC
  `;

  try {
    const [results] = await db.query(query);
    const grouped = groupMedia(results);
    res.json(grouped);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;