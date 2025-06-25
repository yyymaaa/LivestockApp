//livestock-backend/routes/serviceprovider/mylistings.js
const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all service listings for a specific user (Service Provider)
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  console.log(`📥 Incoming request for listings of service provider user_id = ${userId}`);

  try {
    const [rows] = await db.query(`
      SELECT 
        sl.*, 
        lm.url AS image_url 
      FROM service_listing sl
      LEFT JOIN listing_media lm 
        ON sl.offering_id = lm.service_listing_id
      WHERE sl.user_id = ?
    `, [userId]);

    console.log('📦 Raw SQL result:', rows);

    if (!rows || rows.length === 0) {
      console.log('⚠️ No listings found for this service provider.');
      return res.json([]);
    }

    // Group media by offering_id
    const listingsMap = {};

    rows.forEach(row => {
      const offeringId = row.offering_id;

      if (!listingsMap[offeringId]) {
        listingsMap[offeringId] = {
          offering_id: row.offering_id,
          user_id: row.user_id,
          title: row.title,
          description: row.description,
          price: row.price,
          available_slots: row.available_slots,
          status: row.status,
          created_at: row.created_at,
          media: [],
        };
      }

      if (row.image_url) {
        listingsMap[offeringId].media.push({ url: row.image_url });
      }
    });

    const listings = Object.values(listingsMap);

    console.log(`✅ Sending ${listings.length} listing(s) for user_id = ${userId}`);
    res.json(listings);
  } catch (err) {
    console.error('❌ Error fetching service listings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
