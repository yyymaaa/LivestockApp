const db = require('../../config/db'); // Adjust path if needed

exports.createReport = async (req, res) => {
  const {
    reporter_id,         // required
    target_user_id,      // optional
    product_listing_id,  // optional
    service_listing_id,  // optional
    report_type,
    content
  } = req.body;

  if (!reporter_id || !report_type || !content) {
    return res.status(400).json({ error: 'reporter_id, report_type, and content are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO reports (
        reporter_id, target_user_id, product_listing_id, service_listing_id, report_type, content
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        reporter_id,
        target_user_id || null,
        product_listing_id || null,
        service_listing_id || null,
        report_type,
        content,
      ]
    );

    const [newReport] = await db.query(
      `SELECT * FROM reports WHERE report_id = ?`,
      [result.insertId]
    );

    res.status(201).json(newReport[0]);
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [reports] = await db.query(`SELECT * FROM reports ORDER BY created_at DESC`);
    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};
