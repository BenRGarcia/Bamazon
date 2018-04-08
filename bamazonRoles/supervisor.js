// Require dependencies
const inquirer = require('inquirer');
const Database = require('../database/database.js');
const { table } = require('table');
// Create global access to DB if instantiated
let db;
// Define variables for ANSI text display styling
let blueBG = '\u001b[44;1m', blackBG = '\u001b[0m', redBG = '\u001b[41;1m', greenBG = '\u001b[42;1m', white = '\u001b[37m', blue = '\u001b[34m';
// Define questions to ask user
const question1 = {
  name: 'action',
  type: 'list',
  message: 'Which supervisory action would you like to take?',
  choices: ['View Department Sales','Add New Department', 'Exit']
};
const question2 = {
  name: 'department_name',
  type: 'input',
  message: `What is the ${blue}name${white} of the new department?`
};
const question3 = {
  name: 'over_head_costs',
  type: 'input',
  message: `What is the ${blue}over head cost${white} of the new departments?`,
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
      // Clear the terminal upon exit
      console.reset();
      switch (supervisor.action.toLowerCase()) {
        case 'view department sales':
          getSalesData();
          break;
        case 'add new department':
          addNewDepartment();
          break;
        case 'exit':
          exit();
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
      res.forEach(d => {
        let tableRow = [];
        // Conditional formatting for table
        let isProfitable = () => parseInt(d.total_profit) > 0; 
        // Process/Normalize data (handle null values from DB)
        d.product_sales = d.product_sales || 0;
        d.total_profit = d.total_profit || (d.product_sales - d.over_head_costs);
        // Compose table rows
        tableRow.push(d.department_id);
        tableRow.push(d.department_name);
        tableRow.push(`$` + `${d.over_head_costs.toFixed(2)}`.padStart(14));
        tableRow.push(`$` + `${d.product_sales.toFixed(2)}`.padStart(14));
        tableRow.push(`${isProfitable() ? greenBG : redBG}$${d.total_profit.toFixed(2)}`.padStart(14) + `${blackBG}`);
        // Add new row to products array
        departments.push(tableRow);
      });
      let tableConfig = {
        columns: { 
          0: { alignment: 'right' }, 
          2: { alignment: 'right' },
          3: { alignment: 'right' },
          4: { alignment: 'right' },
        }
      }
      // Print *beautiful* table to the console
      console.log(`\n`);
      let departmentTable = table(departments, tableConfig);
      console.log(departmentTable);
      initialize();
    })
}

function addNewDepartment() {
  inquirer
    .prompt(newDepartmentQuestions)
    .then(newDepartment => {
      return db.createNewDepartment(newDepartment);
    })
    .then( isCreated => {
      if (isCreated) console.log(`\n${blueBG}The new department has been created${blackBG}\n`);
      else console.log(`We're sorry, a department by that name ${blueBG} already exists ${blackBG}.`);
      initialize();
    });
}

// Exit program
function exit() {
  db.disconnect();
  // Clear the terminal upon exit
  console.reset();
}

module.exports = Supervisor;
