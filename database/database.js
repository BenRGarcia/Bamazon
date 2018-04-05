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

class Database {

  constructor() {

    /**
     *  Private members: Immutable/read only via predefined class methods
     *    (Not optimized -> memory)
     */

    // Check if in-stock qty is sufficient
    const _isInStock = function (product, order) {
      // Return true/false if qty of product is available
      return product.stock_quantity >= order.qty;
    }

    // Calculates the total cost of the purchase
    const _calculateTotalCost = function (product, order) {
      // Return unit price times qty
      return product.price * order.qty;
    }

    // Executes validated order processing
    const _processOrder = function (product, order) {
      _executeQuery().then();
      // Calculate total cost with calculateTotalCost()
      // Decrease qty and add profit for product in database with updateProductQty()
      // Then, return order object with additional totalCost data
    }

    // Executes MySQL queries
    const _executeQuery = async function (queryString, params = null) {
      try {
        // Query database for all products available for sale
        return await _connection.query(queryString, params, (err, res, fields) => {
          // Error handling
          if (err) throw err;
          // If no error, return results
          return res;
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
  }

  /**
   *  Public/prototypal methods
   */

  // Establish connection with database
  async connect() {
    try {
      await _connection.connect( err => {
        if (err) throw err;
        console.log(`MySQL connected as id: ${_connection.threadId}`);
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Disconnect from database
  async disconnect() {
    await _connection.end();    
  }  

  
  disconnect() {
    console.log(`disconnected from database`);
    return 
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
