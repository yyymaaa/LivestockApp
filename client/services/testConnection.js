const db = require('./dbConnection');

db.query('SELECT NOW() AS time', (err, results) => {
  if (err) {
    console.error('Query error:', err.message);
    return;
  }
  console.log('Current time from database:', results[0].time);
});
