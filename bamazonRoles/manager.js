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
// Define questions to ask user
const q1 = {
  name: 'action',
  type: 'list',
  message: 'Which managerial action would you like to perform?',
  choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
  default: 0
};
const q2 = {
  name: 'item_id',
  type: 'input',
  message: `Please type in the ${blue}ID${white} of the product you wish to increase inventory:`,
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
const q3 = {
  name: 'qty',
  type: 'input',
  message: `Please type in the ${blue}quantity${white} you wish to increase it by:`,
  validate: id => !isNaN(id)
};
const q4 = {
  name: 'product_name',
  type: 'input',
  message: `What is the ${blue}name${white} of the new product you would like to add?`
};
const q5 = {
  name: 'department_name',
  type: 'input',
  message: `What is the ${blue}department${white} of the new product you would like to add?`
};
const q6 = {
  name: 'price',
  type: 'input',
  message: `What is the ${blue}price${white} of the new product you would like to add?`,
  validate: id => !isNaN(id)
};
const q7 = {
  name: 'stock_quantity',
  type: 'input',
  message: `What is the ${blue}quantity${white} of the new product you would like to add?`,
  validate: id => !isNaN(id)
};
// Aggregate questions
const addInventoryQuestions = [q2, q3];
const addNewProductQuestions = [q4, q5, q6, q7];
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
    .prompt(q1)
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
            console.log(`Houston, we have a problem. Manager action ${blueBG} '${manager.action}' ${blackBG} was not recognized.`);
            initialize();
            break;
        }
      });
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
        tableRow.push(`$` + `${product.price.toLocaleString('en', dollarsFormat)}`.padStart(11));
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
        tableRow.push(`$` + `${product.price.toLocaleString('en', dollarsFormat)}`.padStart(11));
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
function addInventory() {
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
// Add new product
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
  // Clear the terminal upon exit
  console.reset();
}

module.exports = Manager;
