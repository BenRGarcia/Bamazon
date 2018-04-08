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
  name: 'department_name',
  type: 'input',
  message: `What is the ${blue} name ${white} of the new department?`
};
const question3 = {
  name: 'over_head_costs',
  type: 'input',
  message: `What is the ${blue} over head cost ${white} of the new departments?`,
  validate: id => !isNaN(id)
};
const newDepartmentQuestions = [question2, question3];

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
  db.getSalesData()
    .then( res => {

      // Create department sales table (nested arrays) with npm 'table' package
      let departments = [[`${blueBG} ID ${blackBG}`, `${blueBG} Department ${blackBG}`, `${blueBG} Overhead Costs ${blackBG}`, `${blueBG} Product Sales ${blackBG}`, `${ blueBG } Total Profit ${ blackBG }`]];
      res.forEach(department => {
        let tableRow = [];
        tableRow.push(department.department_id);
        tableRow.push(department.department_name);
        tableRow.push(`$` + `${department.over_head.costs.toFixed(2)}`.padStart(10));
        tableRow.push(`$` + `${department.product_sales}`.padStart(10));
        tableRow.push(`$` + `${department.total_profit}`.padStart(10));
        // Add new row to products array
        departments.push(tableRow);
      });
      let tableConfig = {
        columns: { 0: { alignment: 'right' }, 3: { alignment: 'right' } }
      }
      // Print *beautiful* table to the console
      console.log(`\n`);
      let productTable = table(products, tableConfig);
      console.log(productTable);
    })
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
