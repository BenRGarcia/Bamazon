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
    // Check if in-stock qty is sufficient to fulfill order
    const _isInStock = function (product, order) {
      return product.stock_quantity >= order.qty;
    }
    // Calculates the total cost of the purchase
    const _calculateTotalCost = function (product, order) {
      return product.price * order.qty;
    }
    // Executes validated order processing
    const _processOrder = function (product, order) {
      return new Promise( (resolve, reject) => {
        // Calculate, store value of order'a total cost
        order.totalCost = _calculateTotalCost(product, order);
        // Define variables with DB values to update
        let stock_quantity = product.stock_quantity - order.qty,
            item_id = order.item_id,
            product_sales = order.totalCost,
            // Define MySQL query to update product data
            queryString = 'UPDATE products SET ? WHERE ?',
            params = [{ stock_quantity, product_sales }, { item_id }];
        // Send query to decrease qty and add profit to DB...
        _executeQuery(queryString, params)
        .then( res => resolve(res))
        .catch( err => reject(err));
      });
    }
    // Executes MySQL queries
    const _executeQuery = function (queryString, params = null) {
      return new Promise( (resolve, reject) => {
        _connection.query(queryString, params, (err, res, fields) => {
          // Error handling
          if (err) reject(err);
          // If no error, return results
          resolve(res);
        });
      });
    }
    // Returns all available products
    this.getAllProducts = function() {
      return new Promise( (resolve, reject) => {
        // Set query definition
        let queryString = 'SELECT * FROM products';
        // Return all products
        _executeQuery(queryString)
        .then(res => resolve(res))
        .catch(err => console.error(err));
      });
    }
    // A function that receives customer orders
    this.placeOrder = function({ item_id, qty }) {
      return new Promise( (resolve, reject) => {
        // Define MySQL query to retrieve product data
        let queryString = 'SELECT * FROM products WHERE ?',
            param = { item_id };
        // Make call to query DB
        _executeQuery(queryString, param)
          // After response received from DB...
          .then(res => {
            // ...parse out product from response
            let product = res[0];
            // If order qty is in stock, process order
            _isInStock(product, order) ? resolve(_processOrder(product, order)) : resolve(false);
          })
          .catch(err => reject(err));
      });
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
      .catch(err => console.error(err));
    }
    // Adds additional qty to a product
    this.addInventory = async function (item_id, qty) {
      // Define variables with DB values to return product
      let queryString = 'SELECT * FROM products WHERE ?',
          param = { item_id };
      // Get the initial qty of product...
      return await _executeQuery(queryString, param)
      // ...then add additional qty
      .then( res => {
        // Define variables with DB values to update
        let item_id = res.item_id,
            stock_quantity = res.stock_quantity + qty,
            // Define MySQL query to update product data
            queryString = 'UPDATE products SET ? WHERE ?',
            params = [{ stock_quantity },{ item_id }];
        // Execute query to update DB
        return _executeQuery(queryString, params);
      })
      .catch(err => console.error(err));
    }
    // Adds new product to the store
    this.addNewProduct = async function ({ product_name, department_name, price, stock_quantity }) {
      // Define MySQL query to add new product
      let queryString = 'INSERT INTO products SET ?',
          param = { product_name, department_name, price, stock_quantity };
      // Execute query to update DB
      return await _executeQuery(queryString, param);
    }
    // Get sales data by department (left join)
    this.getSalesData = async function () {
      let productCols = 'department_name, product_sales',
          join = 'products.department_name = departments.department_name',
          queryString = `SELECT ${productCols} FROM products LEFT JOIN departments ON ${join}`;
      // Perform query with left join to compose sales data
      return await _executeQuery(queryString);
    }
    // An async function that creates a new department
    this.createNewDepartment = async function ({ department_name, over_head_costs }) {
      // Define MySQL query to add new department
      let queryString = 'INSERT INTO departments SET ?',
          params = { department_name, over_head_costs };
      // Perform query to add new department
      return await _executeQuery(queryString, params); 
    }
  }
  // Establish connection with database
  connect() {
    try {
      return new Promise( (resolve, reject) => {
        _connection.connect(err => {
          if (err) reject(err);
          console.log(`MySQL connected as id: ${_connection.threadId}`);
          resolve(true);
        });
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
