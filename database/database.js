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

/* 

Sample order object:

const order = {
  item_id: ?,
  qty: ?,
  totalCost: 
};

*/

class Database {

  constructor() {

    /**
     *  Private members: Immutable/read only via predefined class methods
     *    (Not optimized -> memory, replicated in each instantiation... )
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
    return await _connection.end();
  }

  // An async function that gets low inventory items based on given Qty threshold
  getLowInventory(thresholdQty) {
  // Get all products in database
  // Create empty array
  // Iterate over products
    // if qty < threshold, push object to array
  // Return array of objects
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
