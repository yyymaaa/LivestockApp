const db = require('../../config/db');

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const role = req.query.role || 'all';
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
    let sql = `
      SELECT user_id, username, email, role, contact_info, created_at, is_banned
      FROM user
      WHERE (username LIKE ? OR email LIKE ?)
    `;
    const params = [`%${search}%`, `%${search}%`];

    if (role !== 'all') {
      sql += ' AND role = ?';
      params.push(role);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [users] = await db.query(sql, params);

    let countSql = `
      SELECT COUNT(*) AS count FROM user
      WHERE (username LIKE ? OR email LIKE ?)
    `;
    const countParams = [`%${search}%`, `%${search}%`];

    if (role !== 'all') {
      countSql += ' AND role = ?';
      countParams.push(role);
    }

    const [[{ count }]] = await db.query(countSql, countParams);

    res.json({
      users,
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['farmer', 'serviceprovider', 'productbuyer', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    await db.execute('UPDATE user SET role = ? WHERE user_id = ?', [role, userId]);
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
};
