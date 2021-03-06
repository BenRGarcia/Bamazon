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
// Check if in-stock qty is sufficient to fulfill order
function _isInStock(product, order) {
  return product.stock_quantity >= order.qty;
}
// Calculates the total cost of the purchase
function _calculateTotalCost(product, order) {
  return product.price * order.qty;
}
// Executes validated order processing
function _processOrder(product, order) {
  try {
    return new Promise((resolve, reject) => {
      // Calculate, store value of order'a total cost
      order.totalCost = _calculateTotalCost(product, order);
      // Add product name property to order object
      order.product = product.product_name;
      // Define variables with DB values to update
      let stock_quantity = product.stock_quantity - order.qty,
        product_sales = product.product_sales + order.totalCost,
        item_id = order.item_id,
        // Define MySQL query to update product data
        queryString = 'UPDATE products SET ? WHERE ?',
        params = [{ stock_quantity, product_sales }, { item_id }];
      // Send query to decrease qty and add profit to DB...
      _executeQuery(queryString, params)
        .then(res => resolve(order))
        .catch(err => reject(err));
    });
  } catch (err) {console.error(err);}
}
// Executes MySQL queries
function _executeQuery(queryString, params = null) {
  try {
    return new Promise((resolve, reject) => {
      _connection.query(queryString, params, (err, res, fields) => {
        // Error handling
        if (err) reject(err);
        // If no error, return results
        resolve(res);
      });
    });
  } catch (err) {console.error(err);}
}
// Tests if 'new' department name is actually a duplicate
function _isNewDepartmentDuplicate(newDeptName) {
  try {
    return new Promise((resolve, reject) => {
      let queryString = 'SELECT * FROM departments';
      _connection.query(queryString, (err, res, fields) => {
        if (err) reject(err);
        let isDuplicate = res.some(dept => dept.department_name === newDeptName);
        resolve(isDuplicate);
      });
    });
  } catch (err) {console.error(err);}
}
/**
 *  Database Class Contructor
 */
class Database {
  constructor() {
    // Connect to DB upon instantiation
    try {
      _connection.connect( err => {
        if (err) throw err;
        // console.log(`MySQL connected as id: ${_connection.threadId}`);
      });
    } catch (err) {console.error(err);}
  }
  // Disconnect from database
  disconnect() {
    return _connection.end();
  }
  // Returns all available products
  getAllProducts() {
    try {
      return new Promise((resolve, reject) => {
        // Set query definition
        let queryString = 'SELECT * FROM products';
        // Return all products
        _executeQuery(queryString)
          .then(res => resolve(res))
          .catch(err => reject(err));
      });
    } catch (err) {console.error(err);}
  }
  // A function that receives customer orders
  placeOrder({ item_id, qty }) {
    let order = { item_id, qty };
    try {
      return new Promise((resolve, reject) => {
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
    } catch (err) {console.error(err);}
  }
  // Gets low inventory items based on given Qty
  getLowInventory(lowQty) {
    try {
      return new Promise((resolve, reject) => {
        // Get all products in database
        this.getAllProducts()
          .then(res => {
            // Create new array with only low inventory products
            let lowInventory = res.filter(product => product.stock_quantity <= lowQty);
            resolve(lowInventory);
          })
          .catch(err => reject(err));
      });
    } catch (err) {console.error(err);}
  }
  // Adds additional qty to a product
  addInventory({ item_id, qty }) {
    try {
      return new Promise((resolve, reject) => {
        // Define variables with DB values to return product
        let queryString = 'SELECT * FROM products WHERE ?',
          param = { item_id };
        // Get the initial qty of product...
        _executeQuery(queryString, param)
          // ...then add additional qty
          .then(res => {
            // Define MySQL query to update product data
            let queryString = 'UPDATE products SET ? WHERE ?',
              // Define variables with DB values to update
              stock_quantity = res[0].stock_quantity + qty,
              params = [{ stock_quantity }, { item_id }];
              // Execute query to update DB
              _executeQuery(queryString, params)
                .then(res => resolve(res))
                .catch(err => reject(err));
          })
          .catch(err => {throw err});
      });
    } catch (err) {console.error(err);}
  }
  // Adds new product to the store
  addNewProduct({ product_name, department_name, price, stock_quantity }) {
    try {
      return new Promise((resolve, reject) => {
        // Define MySQL query to add new product
        let queryString = 'INSERT INTO products SET ?',
          param = { product_name, department_name, price, stock_quantity };
        // Execute query to update DB
        _executeQuery(queryString, param)
          .then(res => resolve(res))
          .catch(err => reject(err));
      });
    } catch (err) {console.error(err);}
  }
  // Get sales data by department (JOIN)
  getSalesData() {
    // Define parameters of DB query
    let columns = 
        `departments.department_id,
        departments.department_name,
        departments.over_head_costs,
        SUM(products.product_sales) AS 'product_sales',
        SUM(products.product_sales) - departments.over_head_costs AS 'total_profit'`,
      thisTable = 'products',
      withThisTable = 'departments',
      relation = '(products.department_name = departments.department_name)',
      category = 'department_id',
      // Build DB query string
      queryString = `SELECT 
                      ${columns} 
                    FROM 
                      ${thisTable} 
                        RIGHT JOIN 
                      ${withThisTable} ON ${relation} 
                    GROUP BY ${category}`;
    try {
      return new Promise((resolve, reject) => {
        // Execute DB query
        _executeQuery(queryString)
          .then(res => resolve(res))
          .catch(err => reject(err));
      });
    } catch (err) {console.error(err);}
  }
  // An async function that creates a new department
  createNewDepartment({ department_name, over_head_costs }) {
    try {
      return new Promise((resolve, reject) => {
        // Define MySQL query to add new department
        let queryString = 'INSERT INTO departments SET ?',
          params = { department_name, over_head_costs };
        // Make certain department name is lower case
        params.department_name = params.department_name.toLowerCase();
        // Check if new department name is a duplicate
        _isNewDepartmentDuplicate(params.department_name).then( isDuplicate => {
          // Resolve promise if 'new' dept is a duplicate
          if (isDuplicate) {resolve(!isDuplicate)}
          // Otherwise, perform query to add new department
          else {
            _executeQuery(queryString, params)
              .then(res => resolve(res))
              .catch(err => reject(err));
          }
        });
      });
    } catch (err) {console.error(err);}
  }
}

module.exports = Database;
