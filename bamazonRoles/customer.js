let Database = require('../database/database.js');

let db = new Database();

db.getAllProducts().then( response => {
  console.log(`\nResponse in customer.js:\n`);
  console.log(response);
  db.disconnect();
});
