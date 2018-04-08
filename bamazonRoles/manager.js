// Require dependencies
const inquirer = require('inquirer');
const Database = require('../database/database.js');
const { table } = require('table');
// Create global access to DB if instantiated
let db;
// Define variables for ANSI text display styling
let blueBG = '\u001b[44;1m', blackBG = '\u001b[0m', white = '\u001b[37m', blue = '\u001b[34m';
// Manager Class
class Manager {
  constructor() {
    db = new Database();
  }
  initialize() {
    initialize();
  }
}
// Define question to ask user
const question = {
  name: 'action',
  type: 'list',
  message: 'Which managerial action would you like to perform?',
  choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
  default: 0
};
// Initializes Manager
function initialize() {
  inquirer
    .prompt(question)
      .then(manager => {
        switch (manager.action.toLowerCase()) {
          case 'view products for sale':
            viewProducts();
            break;
          case 'view low inventory':
            viewLowInventory();
            break;
          case 'add to inventory':
            addInventory();
            break;
          case 'add new product':
            addNewProduct();
            break;
          case 'exit':
            exit();
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
  initialize();
}
// View items with low inventory
function viewLowInventory() {
  initialize();
};
// Add inventory to existing product
function addInventory() {
  initialize();
};
// Add new product
function addNewProduct() {
  initialize();
};
// Exit program
function exit() {
  db.disconnect();
}

module.exports = Manager;
