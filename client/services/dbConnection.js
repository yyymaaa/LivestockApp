const mysql = require('mysql2');

// Create the database connection
const db = mysql.createConnection({
  host: '127.0.0.1',       // MySQL server address (localhost)
  user: 'AmyOjuka',            // MySQL username
  password: 'PROJECTS3#',            // MySQL password (empty if none)
  database: 'livestock',   // MySQL database name
  port: 3306               // Default MySQL port
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to the MySQL database:', err.message);
  } else {
    console.log('Connected to the MySQL database (livestock)');
  }
});

module.exports = db;
