// Environment variables
require('dotenv').config()
const keys = require('../config/keys.js');
// Import database package
const mysql = require('mysql');

// Set database connection's .env credentials
const _connection = mysql.createConnection({
  host: keys.mysql.db_host,
  port: keys.mysql.db_port || 3306,
  user: keys.mysql.db_user,
  password: keys.mysql.db_pass,
  database: keys.mysql.db_name,
});

/**
 *  Private Members: variables/methods intentionally not in 'Database' class/constructor
 */

// A non-async function that checks if in-stock qty is sufficient
function _isInStock(product, order) {
  // Check to see if qty of product is available
  // If yes, return true
  // If not, return false
}

// An async function that handles validated order processing
function _processOrder(product, order) {
  // Calculate total cost with calculateTotalCost()
  // Decrease qty and add profit for product in database with updateProductQty()
  // Then, return order object with additional totalCost data
}

// A non-async function that calculates the total cost of the purchase
function _calculateTotalCost(product, order) {
  // Return unit rate cost times qty
}

/* 

_connection.query('', (err, results, fields) => {
      if (err) throw err;
      console.log();
    });

*/

/**
 *  Database Constructor - Intended Public/Priviledged members exposed
 */
class Database {
  constructor() {
    // Establish connection with database
    _connection.connect(err => {
      if (err) throw err;
      console.log(`MySQL connected as id: ${_connection.threadId}`);
    });

    let query = "SELECT * FROM products WHERE item_id = 1";

    _connection.query(query, function (err, res, fields) {
      if (err) throw err;
      // Log all results of the SELECT statement
      let product = res[0];
      console.log(product);
      _connection.end();
      console.log(`Disconnected from MySQL`);
    });

  }

  /**
   *  Prototypal methods (Intentionally Public Members)
   */

  // An async function that displays products for sale (id, name, price)
  async getAllProducts() {
  // Query database for all products available for sale
  // Return all available products as an array of objects
  }

  // An async function that gets low inventory items based on given Qty threshold
  async getLowInventory(thresholdQty) {
  // Get all products in database
  // Create empty array
  // Iterate over products
    // if qty < threshold, push object to array
  // Return array of objects
  }

  // An async function to transact the purchase of a product
  async placeOrder(order) {
    // Retrieve product's current data from the database
    // Check if product qty isInStock()
    // If yes, return response object from processOrder
    // If not, return false
  }

  // An async function to add additional qty to a product
  async addInventory(productId, qty) {
    // Get the initial qty of product
    // Then update product with additional qty amount
    // Return product object with new data
  }

  // An async function to add a completely new object to the store
  async addNewProduct(product) {
    // Send new product with details to database
    // Return products?
  }

  // An async function that gets/returns sales data
  async getSalesData() {
    // Perform query with left?/right?/inner? join to compose sales data
  }

  // An async function that creates a new department
  async createNewDepartment(department) {
    // create mysql command to add new department to table
  }
}

module.exports = Database;
