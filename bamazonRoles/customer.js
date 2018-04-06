// Require database module
let Database = require('../database/database.js');


// 1) Display all available products for purchase
// 2) Which product would you like to buy? (Product ID number)
// 3) How many units would you like to buy?

class Customer {
  // When new customer instantiated...
  constructor() {
    // ...instantiate database object...
    let db = new Database();
    // ...and connect to database
    db.connect().then( () => {
      console.log(`The customer has connected to the database`);
      // Initialize prompts from here?
    }, err => console.error(err));
  }
  async showProducts() {
    return await db.getAllProducts()
    .then( res => {
      console.log(`customer.js -> showProducts response:`);
      console.log(res);
    })
    .catch( err => console.error(err) );
  }
  // Buy product
  async buyProduct(item_id, qty) {
    // Compose order object
    let order = { item_id, qty };
    return await db.placeOrder(order)
    .then( order => {

      let orderSuccessful = function() {
        console.log(`We have processed your. The total comes to ${order.totalCost}`);
        db.disconnect();
      }

      let orderUnsuccessful = function() {
        console.log(`We're sorry, we don't have enough stock to fulfill that order.`);
        db.disconnect();
      }
      return order ? orderSuccessful() : orderUnsuccessful();
    })
    .catch( err => console.error(err) );
  }
}

// module.exports = Customer;

/**
 *  TESTING BELOW
 */

// Create new customer object (which also creates/connects DB)
