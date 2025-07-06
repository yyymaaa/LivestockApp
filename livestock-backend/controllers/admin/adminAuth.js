const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ADMIN_JWT_EXPIRES_IN = '1h';

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE email = ? AND role = ?',
      [email, 'admin']
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: admin.user_id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: ADMIN_JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin.user_id,
        email: admin.email,
        username: admin.username,
        contact: admin.contact_info,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error during admin login' });
  }
};
