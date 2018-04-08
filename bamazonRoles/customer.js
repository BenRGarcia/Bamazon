// Require dependencies
const inquirer = require('inquirer');
const Database = require('../database/database.js');
const { table } = require('table');

// Create global access to DB and Customer object if customer instantiated
let db, customer;

// Define variables for ANSI text display styling
let 
  blueBG = '\u001b[44;1m',
  blackBG = '\u001b[0m',
  white = '\u001b[37m',
  blue = '\u001b[34m';

// Customer Class Constructor
class Customer {
  // When new customer instantiated...
  constructor() {
    // ...instantiate database object
    db = new Database();
  }
  // A function that will get all products from the DB
  getProducts() { // Passing
    return new Promise( (resolve, reject) => {
      db.getAllProducts()
        .then(res => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }
  // Buy product
  buyProduct(item_id, qty) { // Passing
    return new Promise( (resolve, reject) => {
      // Compose order object
      let order = { item_id, qty };
      // Place order
      db.placeOrder(order)
        .then(response => {
          return response ? resolve(_orderSuccessful(response)) : resolve(_orderUnsuccessful(response));
        })
        .catch(err => reject(err));
    });
  }
}
// A function that clears the terminal, resets the cursor
console.reset = () => process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
// Handle when order is successful
function _orderSuccessful(order) {
  return `We have processed your order for ${order.qty} ${order.product}(s).\nYour total comes to $${order.totalCost.toFixed(2)}`;
}
// Handle when order is unsuccessful
function _orderUnsuccessful() {
  return `We're sorry, we don't have enough stock to fulfill that order.`;
}
// Instantiates customer object
function initialize() {
  // Clear the terminal
  console.reset();
  // Instantiate new customer
  customer = new Customer();
  // Retrieve all products from the DB
  customer.getProducts()
    .then( res => {
      // Create product table with npm 'table' package
      let products = [[`${blueBG} ID ${blackBG}`, `${blueBG} Product ${blackBG}`,`${blueBG} Price ${blackBG}`]];
      res.forEach(product => {
        let tableRow = [];
        tableRow.push(product.item_id);
        tableRow.push(product.product_name);
        tableRow.push(`$` + `${product.price.toFixed(2)}`.padStart(10));
        products.push(tableRow);
      });
      let tableConfig = {
        columns: {
          0: {
            alignment: 'right'
          }
        }
      }
      // Print *beautiful* table to the console
      console.log(`\n`);
      let productTable = table(products, tableConfig);
      console.log(productTable);
      // Ask customer to purchase
      promptPurchase(products);
    });
}
// Asks which product to buy
function promptPurchase(products) {
  inquirer
    .prompt([
      {
        name: 'item_id',
        type: 'input',
        message: `Please type in the ${blue}ID${white} of the product you wish to buy:`,
        validate: id => !isNaN(id)
      },
      {
        name: 'qty',
        type: 'input',
        message: `Please type in the ${blue}quantity${white} you wish to purchase:`,
        validate: id => !isNaN(id)
      }
    ])
      // Place customer order
      .then(purchase => {
        console.log(`\nYour order is being placed...\n`);
        // console.log(`You wish to purchase ${purchase.qty} of ID: ${purchase.item_id}`);
        return customer.buyProduct(purchase.item_id, purchase.qty);
      })
      // Log results of order
      .then(orderSuccess => {
        console.log(orderSuccess);
        console.log(`Thank you for shopping at ${blueBG}Bamazon${blackBG}!`);
        db.disconnect();
        return orderSuccess;
      })
      .catch( err => {throw err});
}

module.exports = Customer;
