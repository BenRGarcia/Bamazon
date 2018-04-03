// Environment variables
require('dotenv').config()
const keys = require('../config/keys.js');

// Import database package
const mysql = require('mysql');

// Import mock data
const mockData = require('./mockData.json');

// Set database connection's .env credentials
const connection = mysql.createConnection({
  host: keys.mysql.db_host,
  port: keys.mysql.db_port || 3306,
  user: keys.mysql.db_user,
  password: keys.mysql.db_pass,
  database: keys.mysql.db_name,
});
// Create connection to database
connection.connect( err => {
  if (err) throw err;
  console.log(`Connected as id: ${connection.threadId}`);
  // Initialize database with mock data
  initializeMockData(mockData)
});

// An async function that initializes the DB with mock data on connection
function initializeMockData(data) {
  // Delete current database if it exists
  // Set schema of database for 'products' and 'departments'
  // Add mock data to the database
}

/**
 *  Intended public interface for customer + manager: getAllProducts()
*/
// An async function that displays products for sale (id, name, price)
function getAllProducts() {
  // Query database for all products available for sale
  // Return all available products as an array of objects
}

/**
 *  Intended public interface for customer: placeOrder()
*/
// An async function to transact the purchase of a product
function placeOrder(order) {
  // Retrieve product's current data from the database
  // Check if product qty isInStock()
    // If yes, return response object from processOrder
    // If not, return false
}

// A non-async function that checks if in-stock qty is sufficient
function isInStock(product, order) {
  // Check to see if qty of product is available
    // If yes, return true
    // If not, return false
}

// An async function that handles validated order processing
function processOrder(product, order) {
  // Calculate total cost with calculateTotalCost()
  // Decrease qty and add profit for product in database with updateProductQty()
  // Then, return order object with additional totalCost data
}

// A non-async function that calculates the total cost of the purchase
function calculateTotalCost(product, order) {
  // Return unit rate cost times qty
}

/**
 *  Intended public interface for manager: getLowInventory()
*/
// An async function that gets low inventory items based on given Qty threshold
function getLowInventory(thresholdQty) {
  // Get all products in database
  // Create empty array
  // Iterate over products
    // if qty < threshold, push object to array
  // Return array of objects
}

/**
 *  Intended public interface for manager: addInventory()
*/
// An async function to add additional qty to a product
function addInventory(productId, qty) {
  // Get the initial qty of product
  // Then update product with additional qty amount
  // Return product object with new data
}

/**
 *  Intended public interface for manager: addNewProduct()
*/
// An async function to add a completely new object to the store
function addNewProduct(product) {
  // Send new product with details to database
  // Return products?
}

/**
 *  Intended public interface for supervisor: getSalesData()
*/
// An async function that gets/returns sales data
function getSalesData() {
  // Perform query with left?/right?/inner? join to compose sales data
}
/**
 *  Intended public interface for supervisor: createNewDepartment()
*/
// An async function that creates a new department
function createNewDepartment(department) {
  
}