// Require dependencies
const inquirer = require('inquirer');
// Require 'Customer' role
const Customer = require('./bamazonRoles/customer.js');
// Require 'Manager' role
const Manager = require('./bamazonRoles/manager.js');
// Require 'Supervisor' role
const Supervisor = require('./bamazonRoles/supervisor.js');

// Prompt if a 'customer', 'manager', or 'supervisor'
function determineRole() {
  inquirer
    .prompt({
      name: 'role',
      type: 'list',
      message: 'Welcome to Bamazon! Choose your role:',
      choices: ['Customer', 'Manager', 'Supervisor'],
      default: 0
    })
    .then(user => {
      switch (user.role.toLowerCase()) {
        case 'customer':
          console.log(`You are a customer`);
          // const customer = new Customer();
          break;
        case 'manager':
          console.log(`You are a manager`);
          // const manager = new Manager();
          break;
        case 'supervisor':
          console.log(`You are a supervisor`);
          // const supervisor = new Supervisor();
          break;
        default:
          break;
      }
    });
}

// Initialize
determineRole();
