const express = require('express');
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({
      error: 'Search query is required',
      example: 'Try searching for "veterinary" or "plowing"'
    });
  }

  const searchTerm = `%${query.trim().toLowerCase()}%`;

  // Main query - gets all service listings matching search term
  const sql = `
    SELECT 
      s.offering_id,
      s.title,
      s.description,
      s.price,
      s.status,
      s.created_at,
      s.user_id AS service_provider_id,
      u.name AS provider_name,
      u.contact,
      (
        SELECT lm.url 
        FROM listing_media lm 
        WHERE lm.service_listing_id = s.offering_id 
        ORDER BY lm.photo_id
        LIMIT 1
      ) AS image_url
    FROM service_listing s
    JOIN user u ON s.user_id = u.user_id
    WHERE (LOWER(s.title) LIKE ? OR LOWER(s.description) LIKE ?)
      AND s.status = 'available'
    ORDER BY s.created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [searchTerm, searchTerm]);
    
    // Transform results to match expected frontend structure
    const listings = results.map(item => ({
      offering_id: item.offering_id,
      title: item.title,
      description: item.description,
      price: item.price,
      status: item.status,
      created_at: item.created_at,
      provider_name: item.provider_name,
      contact: item.contact,
      service_provider_id: item.service_provider_id,
      // Maintain both image_url and media array for compatibility
      image_url: item.image_url || null,
      media: item.image_url ? [item.image_url] : []
    }));

    res.json(listings);
  } catch (err) {
    console.error('Search error:', {
      message: err.message,
      sql: err.sql,
      stack: err.stack
    });
    
    res.status(500).json({ 
      error: 'Search failed',
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        sql: err.sql
      } : undefined
    });
  }
});

module.exports = router;