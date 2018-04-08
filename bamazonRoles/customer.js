// Require dependencies
const inquirer = require('inquirer');
const Database = require('../database/database.js');
const { table } = require('table');

// Create global access to DB object if customer instantiated
let db;

// Handle when order is successful
function _orderSuccessful(order) {
  return `We have processed your order for ${order.qty} ${order.product}(s).\nYour total comes to $${order.totalCost.toFixed(2)}`;
}
// Handle when order is unsuccessful
function _orderUnsuccessful() {
  return `We're sorry, we don't have enough stock to fulfill that order.`;
}
// Customer Class Constructor
class Customer {
  // When new customer instantiated...
  constructor() {
    // ...instantiate database object
    db = new Database();
  }
  // A function that will get all products from the DB
  getProducts() { // Passing
    return new Promise( (resolve, reject) => {
      db.getAllProducts()
        .then(res => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }
  // Buy product
  buyProduct(item_id, qty) { // Passing
    return new Promise( (resolve, reject) => {
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
}

module.exports = Customer;

/**
 *  Begin logic for questions
 */
// Initialize module
initialize();
// Instantiates customer object
function initialize() {
  const customer = new Customer();
  customer.getProducts()
    .then( res => {
      // console.log(res);
      let products = [['ID','Product','Price']];
      // let products = res.map(p => `ID: ${p.item_id} ${p.product_name} $${p.price.toFixed(2)}`);
      res.forEach(product => {
        let tableRow = [];
        tableRow.push(product.item_id);
        tableRow.push(product.product_name);
        tableRow.push(`$` + `${product.price.toFixed(2)}`.padStart(10));
        products.push(tableRow);
      });
      let tableConfig = {
        columns: {
          0: {
            alignment: 'right'
          }
        }
      }
      let productTable = table(products, tableConfig);
      console.log(productTable);
      promptPurchase(products);
    });
}
// Asks which product to buy
function promptPurchase(products) {
/*   inquirer
    .prompt()
    .then(choice => {
    }); */
}
