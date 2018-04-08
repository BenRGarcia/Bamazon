// Require dependencies
const inquirer = require('inquirer');
// Require 'Customer', 'Manager', 'Supervisor' roles
const Customer = require('./bamazonRoles/customer.js');
const Manager = require('./bamazonRoles/manager.js');
const Supervisor = require('./bamazonRoles/supervisor.js');

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
          // const manager = new Manager();
          // manager.initialize();
          break;
        case 'supervisor':
          // const supervisor = new Supervisor();
          // supervisor.initialize();
          break;
        default:
          console.log(`Houston, we have a problem. Role '${user.role}' was not recognized.`);
          break;
      }
    });
}

// Initialize app
determineRole();
