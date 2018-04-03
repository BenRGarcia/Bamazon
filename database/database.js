// Environment variables
require('dotenv').config()
const keys = require('../config/keys.js');

// Import database package
const mysql = require('mysql');

// Establish connection to database with .env credentials
const connection = mysql.createConnection({
  host: keys.mysql.db_host,
  port: keys.mysql.db_port || 3306,
  user: keys.mysql.db_user,
  password: keys.mysql.db_pass,
  database: keys.mysql.db_name,
});
connection.connect( err => {
  if (err) throw err;
  console.log(`Connected as id: ${connection.threadId}`);
});
