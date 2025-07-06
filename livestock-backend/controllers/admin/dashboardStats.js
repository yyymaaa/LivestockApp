
const db = require('../../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query(`SELECT COUNT(*) AS total_users FROM user`);
    const [[{ active_users }]] = await db.query(`
      SELECT COUNT(*) AS active_users
      FROM user
      WHERE last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const [[{ product_listings }]] = await db.query(`SELECT COUNT(*) AS product_listings FROM product_listing`);
    const [[{ service_listings }]] = await db.query(`SELECT COUNT(*) AS service_listings FROM service_listing`);

    res.json({
      users: total_users,
      activeUsers: active_users,
      listings: product_listings + service_listings,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

