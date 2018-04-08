// Require dependencies
const inquirer = require('inquirer');
const Database = require('../database/database.js');
const { table } = require('table');
// Create global access to DB if instantiated
let db;
// Define variables for ANSI text display styling
let blueBG = '\u001b[44;1m', blackBG = '\u001b[0m', white = '\u001b[37m', blue = '\u001b[34m';
// Define questions to ask user
const question1 = {
  name: 'action',
  type: 'list',
  message: 'Which managerial action would you like to perform?',
  choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
  default: 0
};
const question2 = {
  name: 'item_id',
  type: 'input',
  message: `Please type in the ${blue}ID${white} of the product you wish to increase inventory:`,
  validate: id => !isNaN(id)
};
const question3 = {
  name: 'qty',
  type: 'input',
  message: `Please type in the ${blue}quantity${white} you wish to increase it by:`,
  validate: id => !isNaN(id)
};
// product_name, department_name, price, stock_quantity
const question4 = {
  name: 'product_name',
  type: 'input',
  message: `What is the ${blue}name${white} of the new product you would like to add?`
};
const question5 = {
  name: 'department_name',
  type: 'input',
  message: `What is the ${blue}department${white} of the new product you would like to add?`
};
const question6 = {
  name: 'price',
  type: 'input',
  message: `What is the ${blue}price${white} of the new product you would like to add?`,
  validate: id => !isNaN(id)
};
const question7 = {
  name: 'stock_quantity',
  type: 'input',
  message: `What is the ${blue}quantity${white} of the new product you would like to add?`,
  validate: id => !isNaN(id)
};
// Aggregate questions
const addInventoryQuestions = [question2, question3];
const addNewProductQuestions = [question4, question5, question6, question7];
// Manager Class
class Manager {
  constructor() {
    db = new Database();
  }
  initialize() {
    initialize();
  }
}
// Initializes Manager
function initialize() {
  inquirer
    .prompt(question1)
      .then(manager => {
        switch (manager.action.toLowerCase()) {
          case 'view products for sale':
            return viewProducts();
            break;
          case 'view low inventory':
            return viewLowInventory();
            break;
          case 'add to inventory':
            return addInventory();
            break;
          case 'add new product':
            return addNewProduct();
            break;
          case 'exit':
            return exit();
            break;
          default:
            console.log(`Houston, we have a problem. Manager action '${manager.action}' was not recognized.`);
            break;
        }
      })
      .catch(err => {throw err});
}
// View all products
function viewProducts() {
  // Clear the terminal
  console.reset();
  db.getAllProducts()
    .then(res => {
      // Create product table (nested arrays) with npm 'table' package
      let products = [[`${blueBG} ID ${blackBG}`, `${blueBG} All Products ${blackBG}`, `${blueBG} Price ${blackBG}`, `${blueBG} Qty ${blackBG}`]];
      res.forEach(product => {
        let tableRow = [];
        tableRow.push(product.item_id);
        tableRow.push(product.product_name);
        tableRow.push(`$` + `${product.price.toFixed(2)}`.padStart(10));
        tableRow.push(product.stock_quantity);
        products.push(tableRow);
      });
      let tableConfig = {
        columns: { 0: { alignment: 'right' }, 3: { alignment: 'right' } }
      }
      // Print *beautiful* table to the console
      console.log(`\n`);
      let productTable = table(products, tableConfig);
      console.log(productTable);
    })
    .then(() => {
      // Return to initial prompt when complete
      return initialize();
    })
    .catch(err => { throw err });
}
// View items with low inventory
function viewLowInventory() {
  // Clear the terminal
  console.reset();
  let lowInventoryThreshold = 5;
  db.getLowInventory(lowInventoryThreshold)
    .then( res => {
      // Create product table (nested arrays) with npm 'table' package
      let products = [[`${blueBG} ID ${blackBG}`, `${blueBG} Low Inventory Products ${blackBG}`, `${blueBG} Price ${blackBG}`, `${blueBG} Qty ${blackBG}`]];
      res.forEach(product => {
        let tableRow = [];
        tableRow.push(product.item_id);
        tableRow.push(product.product_name);
        tableRow.push(`$` + `${product.price.toFixed(2)}`.padStart(10));
        tableRow.push(product.stock_quantity);
        // Add new row to products array
        products.push(tableRow);
      });
      let tableConfig = {
        columns: { 0: { alignment: 'right' }, 3: { alignment: 'right' } }
      }
      // Print *beautiful* table to the console
      console.log(`\n`);
      let productTable = table(products, tableConfig);
      console.log(productTable);
    })
    .then(() => {
      // Return to initial prompt when complete
      return initialize();
    })
    .catch(err => { throw err });
};
// Add inventory to existing product
function addInventory() { // item_id AND qty -> { item_id, qty}
  inquirer
    .prompt(addInventoryQuestions)
    .then(inventory => {
      let item_id = parseInt(inventory.item_id),
        qty = parseInt(inventory.qty);
      return db.addInventory({ item_id, qty });
    })
    .then(() => {
      console.log(`\n${blueBG} The new inventory has been added ${blackBG}\n`);
      initialize();
    })
    .catch(err => { throw err });
};
// Add new product : product_name, department_name, price, stock_quantity
function addNewProduct() {
  inquirer
    .prompt(addNewProductQuestions)
    .then( newItem => {
      return db.addNewProduct(newItem);
    })
    .then(() => {
      console.log(`\n${blueBG} The new product has been added ${blackBG}\n`);
      initialize();
    })
    .catch(err => { throw err });
};
// Exit program
function exit() {
  db.disconnect();
  // Clear the terminal
  console.reset();
}

module.exports = Manager;
