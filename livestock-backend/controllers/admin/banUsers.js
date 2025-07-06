
exports.banUser = async (req, res) => {
  const { userId } = req.params;
  const { isBanned } = req.body;
  const adminId = req.user.userId;

  try {
    await db.execute('UPDATE user SET is_banned = ? WHERE user_id = ?', [isBanned ? 1 : 0, userId]);

    const actionDescription = isBanned ? 'Banned user' : 'Unbanned user';
    await db.execute(`
      INSERT INTO admin_logs (admin_id, action, target_user_id)
      VALUES (?, ?, ?)
    `, [adminId, actionDescription, userId]);

    res.json({ message: actionDescription });
  } catch (err) {
    console.error('Error banning user:', err);
    res.status(500).json({ error: 'Failed to ban user' });
  }
};



