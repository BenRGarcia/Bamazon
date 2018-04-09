# Bamazon

> A command line app where customers can buy products, managers can manage inventory, and supervisors can review sales reports

* **Node.js**, **MySQL**, npm packages: **inquirer**, **mysql**, **table**, **dotenv**

## Description

### App entry point: ```bamazon.js```

![](https://user-images.githubusercontent.com/26657982/38477186-5f45cc44-3b7f-11e8-8585-81e7872493dc.gif)

### For 'Customers'

![](https://user-images.githubusercontent.com/26657982/38477184-5f2f3736-3b7f-11e8-9a17-56c1075a7d3d.gif)

![](https://user-images.githubusercontent.com/26657982/38477185-5f38f5d2-3b7f-11e8-9b60-799d5f978ab5.gif)

1. Customers can purchase products in specified quantities
2. Database is updated after successful purchase to decrease in-stock quantity and add sales revenue
3. Customers cannot purchase more quantity than exist in the database
4. Input validation ensures 'Item Id' inputs are valid item id's

### For 'Managers'

![](https://user-images.githubusercontent.com/26657982/38477182-5f1b5298-3b7f-11e8-9705-b5fcf3a45782.gif)


1. Managers can view all available products for sale
2. Managers can view products which are running low in stock
3. Managers can replenish stock of specified product
4. Managers can add new products

### For 'Supervisors'

![](https://user-images.githubusercontent.com/26657982/38477182-5f1b5298-3b7f-11e8-9705-b5fcf3a45782.gif)

1. Supervisors can view department sales reports (MySQL JOIN query)
2. Conditional formatting of profit/loss fields
3. Supervisors can add new departments