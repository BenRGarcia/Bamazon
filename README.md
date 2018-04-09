# Bamazon

> A command line app where customers can buy products, managers can manage inventory, and supervisors can review sales reports

* **Node.js**, **MySQL**, npm packages: **inquirer**, **mysql**, **table**, **dotenv**

## Description

### App entry point: ```bamazon.js```

[App Entry Point Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazon.js)

#### Splash Screen

![Program Startup](https://user-images.githubusercontent.com/26657982/38507279-20dfe74e-3bea-11e8-8a71-18e2e76b85b8.gif)

### MySQL Database

1. Deliberate management of public/priviledged/private, immmutable/mutable members
2. Extensive use of Promises and Error Handling for asynchronous database interaction
3. All user inputs sanitized, no unescaped inputs have access to database

[Database Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/database/database.js)

### For 'Customers'

1. Customers can purchase products in specified quantities
2. Database is updated after successful purchase to decrease in-stock quantity and add sales revenue
3. Customers cannot purchase more quantity than exists in the database
4. Input validation ensures 'Item Id' inputs are valid item id's

[Customer Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazonRoles/customer.js)

#### Successful Customer Purchase

![Customer Purchase](https://user-images.githubusercontent.com/26657982/38507065-7d4d19e4-3be9-11e8-95fa-e95e97a3b0f7.gif)

#### Unsuccessful Customer Purchase

![Customer Purchase Error Handling](https://user-images.githubusercontent.com/26657982/38507474-995b6b9e-3bea-11e8-89b6-ab76192a6903.gif)

### For 'Managers'

1. Managers can view all available products for sale
2. Managers can view products which are running low in stock
3. Managers can replenish stock of specified product
4. Managers can add new products

[Manager Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazonRoles/manager.js)

#### View All Products, Low Inventory Products

![View Products/Low Inventory](https://user-images.githubusercontent.com/26657982/38507826-92e927aa-3beb-11e8-856d-a9be70394275.gif)

#### Add Product Quantity

![Add Product Qty](https://user-images.githubusercontent.com/26657982/38508050-22d1df88-3bec-11e8-9e34-c756fa7b9d3b.gif)

#### Add New Product

![Add New Product](https://user-images.githubusercontent.com/26657982/38508288-cd76fc52-3bec-11e8-8d57-6a8030454d77.gif)

### For 'Supervisors'

1. Supervisors can view department sales reports (MySQL JOIN query)
2. Conditional formatting of profit/loss fields
3. Supervisors can add new departments

[Supervisor Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazonRoles/supervisor.js)

#### View Department Profit/Loss Summary

![View Dept Sales](https://user-images.githubusercontent.com/26657982/38508693-e61e3a12-3bed-11e8-9e04-595801c6fc5d.gif)

#### Add New Department

![Add New Department](https://user-images.githubusercontent.com/26657982/38508939-75cf8ad0-3bee-11e8-831e-5cea24f7b9b9.gif)