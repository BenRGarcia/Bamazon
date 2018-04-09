# Bamazon

> A command line app where customers can buy products, managers can manage inventory, and supervisors can review sales reports

* **Node.js**, **MySQL**, npm packages: **inquirer**, **mysql**, **table**, **dotenv**

## Description

### App entry point: ```bamazon.js```

![](https://user-images.githubusercontent.com/26657982/38476086-074e90b6-3b7a-11e8-8276-68769fe22563.gif)


### For 'Customers'

[Insert gif of customer purchase with DB update]()

![](https://user-images.githubusercontent.com/26657982/38476384-75c1a028-3b7b-11e8-8921-0e23f11ac32d.gif)

1. Customers can purchase products in specified quantities
2. Database is updated after successful purchase to decrease in-stock quantity and add sales revenue
3. Customers cannot purchase more quantity than exist in the database
4. Input validation ensures 'Item Id' inputs are valid item id's

### For 'Managers'

[Insert gif of manager functionality]()

[Insert gif of database updating increased inventory and adding new product]()

1. Managers can view all available products for sale
2. Managers can view products which are running low in stock
3. Managers can replenish stock of specified product
4. Managers can add new products

### For 'Supervisors'

[Insert gif of Supervisor functionality]()

[Insert gif of database updating with new department info]()

1. Supervisors can view department sales reports (MySQL JOIN query)
2. Conditional formatting of profit/loss fields
3. Supervisors can add new departments