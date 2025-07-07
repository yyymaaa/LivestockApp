const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Enhanced error logging middleware
const logError = (err) => {
  console.error('\n--- DATABASE ERROR DETAILS ---');
  console.error('Message:', err.message);
  console.error('SQL:', err.sql);
  console.error('Code:', err.code);
  console.error('Stack:', err.stack);
  console.error('---------------------------\n');
};

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
      contact,
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
        contact, 
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
      u.contact,  
      m.url
    FROM service_listing s
    JOIN user u ON s.user_id = u.user_id
    LEFT JOIN listing_media m ON s.offering_id = m.service_listing_id
    WHERE s.status = 'available'
    ORDER BY s.created_at DESC
  `;

  console.log('Executing query:', query); // Log the exact query being run

  try {
    const [results] = await db.query(query);
    console.log('Raw query results:', results); // Log raw results
    const grouped = groupMedia(results);
    res.json(grouped);
  } catch (err) {
    logError(err); // Use our enhanced error logger
    
    // Send more detailed error info in development
    const errorResponse = {
      error: 'Database error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && {
        sql: err.sql,
        code: err.code,
        stack: err.stack
      })
    };
    
    res.status(500).json(errorResponse);
  }
});

module.exports = router;