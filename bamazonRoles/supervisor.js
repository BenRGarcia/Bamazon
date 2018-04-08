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
  message: 'Which supervisory action would you like to take?',
  choices: ['View Department Sales','Add New Department']
};
const question2 = {
  name: '',
  type: '',
  message: '',
};
const question3 = {
  name: '',
  type: '',
  message: '',
};
const question4 = {
  name: '',
  type: '',
  message: '',
};

class Supervisor {
  constructor() {
    db = new Database();
  }
  initialize() {
    initialize();
  }
}

function initialize() {
  inquirer
    .prompt(question1)
    .then( supervisor => {
      switch (supervisor.action.toLowerCase()) {
        case 'view department sales':
          getSalesData();
          break;
        case 'add new department':
          addNewDepartment();
          break;
        default:
          console.log(`Houston, we have a problem. Supervisor action ${blueBG} '${supervisor.action}' ${blackBG} was not recognized.`);
          initialize()
          break;
      }
    });
}

function getSalesData() {

}

function addNewDepartment() {
  
}

// Exit program
function exit() {
  db.disconnect();
  // Clear the terminal upon exit
  console.reset();
}

module.exports = Supervisor;
