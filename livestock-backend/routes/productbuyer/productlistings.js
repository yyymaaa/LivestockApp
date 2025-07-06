//livestock-backend/routes/productbuyer/productlistings.js
const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Group media by listing
function groupMedia(results) {
  const grouped = {};

  results.forEach(row => {
    const {
      listing_id,
      title,
      description,
      price_per_unit,
      quantity_available,
      status,
      created_at,
      name,
      contact,
      url,
    } = row;

    if (!grouped[listing_id]) {
      grouped[listing_id] = {
        listing_id,
        title,
        description,
        price_per_unit,
        quantity_available,
        status,
        created_at,
        farmer_name: name,
        farmer_contact: contact,
        media: [],
      };
    }

    if (url && !grouped[listing_id].media.includes(url)) {
      grouped[listing_id].media.push(url);
    }
  });

  return Object.values(grouped);
}

// GET /api/productbuyer/productlistings
router.get('/', async (req, res) => {
  console.log('📥 [GET] /api/productbuyer/products received');

  const query = `
    SELECT
      p.listing_id,
      p.title,
      p.description,
      p.price_per_unit,
      p.quantity_available,
      p.status,
      p.created_at,
      u.name,
      u.contact,
      m.url
    FROM product_listing p
    JOIN user u ON p.user_id = u.user_id
    LEFT JOIN listing_media m ON p.listing_id = m.product_listing_id
    WHERE p.status = 'available'
    ORDER BY p.created_at DESC
  `;

  try {
    console.log('🛠 Executing SQL query...');
    const [results] = await db.query(query);

    console.log('✅ Raw DB results:', results);

    const grouped = groupMedia(results);
    console.log('✅ Grouped results:', grouped);

    res.json(grouped);
  } catch (err) {
    console.error('❌ Database error:', err); // log full error, not just message
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;