const db = require('../../config/db');

exports.getAdminLogs = async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT 
        l.log_id,
        l.timestamp,
        l.action,
        a.username AS admin_name,
        u.username AS target_name
      FROM admin_logs l
      JOIN user a ON l.admin_id = a.user_id
      LEFT JOIN user u ON l.target_user_id = u.user_id
      ORDER BY l.timestamp DESC
    `);
    res.json(logs);
  } catch (err) {
    console.error('[ADMIN LOG ERROR]:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
