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
 *  Thoughts:
 *    1) Effective encapsulation/information hiding, absolutely minimized public interface
 *        * Rely on ES6 module syntax? (put 'private members' in module's global scope and don't export)
 *        * Let constructor be a little wasteful with memory?
 *        * Create a bridge/switch statement to route prototypal method calls to private/priviledged members
 *        * Should I emulate C "Interfaces" to test implementations on params passed?
 *    2) Open/Closed Principle
 *        * How far to go with closed to modification (Object.seal/freeze/defineProperty - read/write/enum/config)
 *    3) How to minimize DB round trips
 *        * feels inefficienct -> 1) retrieve initial data, process data based on current value,
 *                                2) post new/updated data, 
 *                                3) get DB response absent errors
 *                                4) again retrieve data to actually see new info
 *
 */

class Database {

  constructor() {

    // Establish connection with database upon instantiation
    _connection.connect(err => {
      if (err) throw err;
      console.log(`MySQL connected as id: ${_connection.threadId}`);
    });

    /**
     *  Private members (Disadvantage = memory -> a copy made in each instantiation)
     */

    // Check if in-stock qty is sufficient
    var _isInStock = function(product, order) {
      // Return true if qty of product is available, otherwise false
    }

    // Executes validated order processing
    var _processOrder = function (product, order) {
      // Calculate total cost with calculateTotalCost()
      // Decrease qty and add profit for product in database with updateProductQty()
      // Then, return order object with additional totalCost data
    }

    // Calculates the total cost of the purchase
    var _calculateTotalCost = function (product, order) {
      // Return unit rate cost times qty
    }

    /**
     *  Priviledged members
     */

    // Database query strings routed through this method (DRY optimization)
    var _executeQuery = function (queryString) {
      try {
        return new Promise( (resolve, reject) => {
          // Query database for all products available for sale
          _connection.query(queryString, (err, res, fields) => {
            // Error handling
            if (err) reject(err);
            // If no error, resolve Promise
            resolve(res);
          });
        });
      } catch (error) {
        console.error(error);
      }
    }

    // Returns all available products
    this.getAllProducts = async function() {
      // Set query definition
      let queryString = 'SELECT * FROM products';
      // Return all products
      return await _executeQuery(queryString);
    }

    // A bridge from public/prototypal members to access private members?
    this.bridge = async function(command, ...params) {
      return await command(params);
    }
  }

  /**
   *  Public/prototypal methods
   */

  // Disconnect from database
  disconnect() {
    return _connection.end();
  }

  // An async function that gets low inventory items based on given Qty threshold
  getLowInventory(thresholdQty) {
  // Get all products in database
  // Create empty array
  // Iterate over products
    // if qty < threshold, push object to array
  // Return array of objects
  }

  // An async function to transact the purchase of a product
  placeOrder(order) {
    // Retrieve product's current data from the database
    // Check if product qty isInStock()
    // If yes, return response object from processOrder
    // If not, return false
  }

  // An async function to add additional qty to a product
  addInventory(productId, qty) {
    // Get the initial qty of product
    // Then update product with additional qty amount
    // Return product object with new data
  }

  // An async function to add a completely new object to the store
  addNewProduct(product) {
    // Send new product with details to database
    // Return products?
  }

  // An async function that gets/returns sales data
  getSalesData() {
    // Perform query with left?/right?/inner? join to compose sales data
  }

  // An async function that creates a new department
  createNewDepartment(department) {
    // create mysql command to add new department to table
  }
}

module.exports = Database;
