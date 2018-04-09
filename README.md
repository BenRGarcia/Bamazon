# Bamazon

> A command line app where customers can buy products, managers can manage inventory, and supervisors can review sales reports

* **Node.js**, **MySQL**, npm packages: **inquirer**, **mysql**, **table**, **dotenv**

(Apologies for the slow GIFs -- they seem to be playing at half speed...)

## Description

### App entry point: ```bamazon.js```

[App Entry Point Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazon.js)

#### Splash Screen

![](https://user-images.githubusercontent.com/26657982/38477186-5f45cc44-3b7f-11e8-8585-81e7872493dc.gif)

### MySQL Database

1. Deliberate management of public/priviledged/private, immmutable/mutable members
2. Extensive use of Promises and Error Handling for asynchronous database interaction

[Database Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/database/database.js)

### For 'Customers'

1. Customers can purchase products in specified quantities
2. Database is updated after successful purchase to decrease in-stock quantity and add sales revenue
3. Customers cannot purchase more quantity than exist in the database
4. Input validation ensures 'Item Id' inputs are valid item id's

[Customer Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazonRoles/customer.js)

#### Successful Customer Purchase

![](https://user-images.githubusercontent.com/26657982/38477184-5f2f3736-3b7f-11e8-9a17-56c1075a7d3d.gif)

#### Unsuccessful Customer Purchase

![](https://user-images.githubusercontent.com/26657982/38477185-5f38f5d2-3b7f-11e8-9b60-799d5f978ab5.gif)

### For 'Managers'

1. Managers can view all available products for sale
2. Managers can view products which are running low in stock
3. Managers can replenish stock of specified product
4. Managers can add new products

[Manager Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazonRoles/manager.js)

#### Manager Functionality

![](https://user-images.githubusercontent.com/26657982/38477182-5f1b5298-3b7f-11e8-9705-b5fcf3a45782.gif)

### For 'Supervisors'

1. Supervisors can view department sales reports (MySQL JOIN query)
2. Conditional formatting of profit/loss fields
3. Supervisors can add new departments

[Supervisor Module Source Code](https://github.com/BenRGarcia/Bamazon/blob/master/bamazonRoles/supervisor.js)

#### Supervisor Functionality

![](https://user-images.githubusercontent.com/26657982/38477183-5f257566-3b7f-11e8-8bc0-aded23e9cd16.gif)