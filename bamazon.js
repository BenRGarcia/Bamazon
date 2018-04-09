// Require dependencies
const inquirer = require('inquirer');
const fs = require('fs');
// Require 'Customer', 'Manager', 'Supervisor' roles
const Customer = require('./bamazonRoles/customer.js');
const Manager = require('./bamazonRoles/manager.js');
const Supervisor = require('./bamazonRoles/supervisor.js');

// Define variables for ANSI text display styling
let blueBG = '\u001b[44;1m', blackBG = '\u001b[0m', white = '\u001b[37m', blue = '\u001b[34m';

// A function that clears the terminal, resets the cursor
console.reset = () => process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');

// Define question to ask user
const question = {
  name: 'role',
  type: 'list',
  message: 'Welcome to Bamazon! Choose your role:',
  choices: ['Customer', 'Manager', 'Supervisor'],
  default: 0
};

// Prompt user to select role
function determineRole() {
  inquirer
    .prompt(question)
    .then(user => {
      switch (user.role.toLowerCase()) {
        case 'customer':
          const customer = new Customer();
          customer.initialize();
          break;
        case 'manager':
          const manager = new Manager();
          manager.initialize();
          break;
        case 'supervisor':
          const supervisor = new Supervisor();
          supervisor.initialize();
          break;
        default:
          console.log(`Houston, we have a problem. Role ${blueBG} '${user.role}' ${blackBG} was not recognized.`);
          break;
      }
    });
}

// Print welcome screen
fs.readFile('./bamazon.txt', 'utf8', (err, data) => {
  // Clear the terminal
  console.reset();
  console.log(data);
  console.log(`\n`);
  // Initialize app
  determineRole();
})
