// Require dependencies
const inquirer = require('inquirer');
const Database = require('../database/database.js');
const { table } = require('table');
// Create global access to DB if instantiated
let db;
// Format display of USD
let dollarsFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
// Define variables for ANSI text display styling
let blueBG = '\u001b[44;1m', blackBG = '\u001b[0m', redBG = '\u001b[41;1m', white = '\u001b[37m', blue = '\u001b[34m';
// Define questions with which to prompt customer
const question1 = {
  name: 'item_id',
  type: 'input',
  message: `Please type in the ${blue}ID${white} of the product you wish to buy:`,
  validate: (item_id) => {
    return new Promise((resolve, reject) => {
      db.getAllProducts()
        .then(products => {
          // Screen out non-numbers
          if (!isNaN(item_id)) {
            // Screen out item_id's not in DB
            products.forEach(p => {
              if (p.item_id == item_id) resolve(true);
            });
          }
          resolve(`That ID is ${redBG} invalid ${blackBG}`);
        })
        .catch(err => reject(err));
    });
  }
};
const question2 = {
  name: 'qty',
  type: 'input',
  message: `Please type in the ${blue}quantity${white} you wish to purchase:`,
  validate: qty => !isNaN(qty)
};
// Aggregate questions to be asked
const questions = [question1, question2];
// Customer Class Constructor
class Customer {
  constructor() {
    db = new Database();
  }
  initialize() {
    initialize();
  }
}
// Initializes customer
function initialize() {
  // Clear the terminal
  console.reset();
  // Retrieve all products from the DB
  getProducts()
    .then(res => {
      // Create product table (nested arrays) with npm 'table' package
      let products = [[`${blueBG} ID ${blackBG}`, `${blueBG} Product ${blackBG}`, `${blueBG} Price ${blackBG}`]];
      res.forEach(product => {
        let tableRow = [];
        tableRow.push(product.item_id);
        tableRow.push(product.product_name);
        tableRow.push(`$` + `${product.price.toLocaleString('en', dollarsFormat)}`.padStart(10));
        // Add new row to products array
        products.push(tableRow);
      });
      let tableConfig = {
        columns: { 0: { alignment: 'right' } }
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
    .prompt(questions)
    // Place customer order
    .then(purchase => {
      return buyProduct(purchase.item_id, purchase.qty);
    })
    // Log results of order
    .then(orderSuccess => {
      console.log(orderSuccess);
      console.log(`Thank you for shopping at ${blueBG}Bamazon${blackBG}!`);
      db.disconnect();
      return orderSuccess;
    })
    .catch(err => { throw err });
}
// A function that clears the terminal, resets the cursor
console.reset = () => process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
// A function that will get all products from the DB
function getProducts() {
  return new Promise((resolve, reject) => {
    db.getAllProducts()
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
}
// Buy product
function buyProduct(item_id, qty) {
  return new Promise((resolve, reject) => {
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
// Handle if order is successful
function _orderSuccessful(order) {
  return `\n${blueBG} We have processed your order for ${order.qty} ${order.product}(s) ${blackBG}.\n\nYour total comes to ${blueBG} $${order.totalCost.toLocaleString('en', dollarsFormat)} ${blackBG}\n`;
}
// Handle if order is unsuccessful
function _orderUnsuccessful() {
  return `\n${blueBG} We're sorry, we don't have enough stock to fulfill that order.${blackBG}\n`;
}

module.exports = Customer;
