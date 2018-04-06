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

/* Sample order object:
 *   const order = {
 *     item_id: ?,
 *     qty: ?,
 *     totalCost: ?
 *   };
 */

class Database {

  constructor() {

    /**
     *  Private members: Immutable/read only via predefined class methods
     *    (Not optimized -> memory, replicated in each instantiation...)
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
    const _processOrder = async function (product, order) {
      // Calculate, store value of order'a total cost
      order.totalCost = _calculateTotalCost(product, order);
          // Define variables with DB values to update
      let stock_quantity = product.stock_quantity - order.qty,
          item_id = order.item_id,
          product_sales = order.totalCost,
          // Define MySQL query to update product data
          queryString = 'UPDATE products SET ? WHERE ?',
          params = [{ stock_quantity, product_sales },{ item_id }];
      // Send query to decrease qty and add profit to DB...
      return await _executeQuery(queryString, params)
      // ...then return order object
      .then( () => {
        return order;
      })
      .catch( err => console.error(err) ); 
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
      } catch (err) {
        console.error(err);
      }
    }

    /**
     *  Priviledged Members - Intended Public interface, interacts with private members
     */

    // Returns all available products
    this.getAllProducts = async function() {
      // Set query definition
      let queryString = 'SELECT * FROM products';
      // Return all products
      return await _executeQuery(queryString);
    }

    // A function that receives customer orders
    this.placeOrder = async function(order) {
      // If item_id not present, throw fatal error (In future, use an Interface?)
      if (!order.item_id) throw error;
      // Define MySQL query to retrieve product data
      let queryString = 'SELECT * FROM products WHERE ?',
          param = { item_id: order.item_id };
      // Make call to query DB
      return await _executeQuery(queryString, param)
      // After response received from DB...
      .then( res => {
        // ...parse out product from response
        let product = res[0];
        // If order qty is in stock, process order
        return _isInStock(product, order) ? _processOrder(product, order) : false;
      })
      .catch( err => console.error(err) );
    }

    // Gets low inventory items based on given Qty
    this.getLowInventory = async function (lowQty) {
      // Get all products in database
      return await this.getAllProducts()
      .then( res => {
        // Create new array with only low inventory products
        let lowInventory = res.filter( product => product.stock_quantity <= lowQty);
        return lowInventory;
      })
      .catch( err => console.error(err) );
    }

    // Adds additional qty to a product
    this.addInventory = async function (productId, qty) {
      // Get the initial qty of product
      // Then update product with additional qty amount
      // Return product object with new data
    }

    // Adds a completely new object to the store
    this.addNewProduct = async function (product) {
      // Send new product with details to database
      // Return products?
    }

    // Gets sales data
    this.getSalesData = async function () {
      // Perform query with left?/right?/inner? join to compose sales data
    }

    // An async function that creates a new department
    this.createNewDepartment = async function (department) {
      // create mysql command to add new department to table
    }
  }

  /**
   *  Public/prototypal methods
   */

  // Establish connection with database
  async connect() {
    try {
      return await _connection.connect( err => {
        if (err) throw err;
        console.log(`MySQL connected as id: ${_connection.threadId}`);
        return true;
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Disconnect from database
  disconnect() {
    return _connection.end();
  }
}

module.exports = Database;
