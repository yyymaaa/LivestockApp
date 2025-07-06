const db = require('../../config/db');

exports.getListings = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [listings] = await db.query(`
      SELECT listing_id, title, status, created_at, user_id
      FROM product_listing
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [[{ count }]] = await db.query(`SELECT COUNT(*) AS count FROM product_listing`);

    res.json({
      listings,
      totalListings: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

exports.deleteListing = async (req, res) => {
  const { listingId } = req.params;

  try {
    await db.execute('DELETE FROM product_listing WHERE listing_id = ?', [listingId]);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};
