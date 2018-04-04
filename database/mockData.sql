DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(40) NOT NULL,
  department_name VARCHAR(40) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(40) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES  ("Steinway Model D Concert Grand Piano", "Instruments", 150000.00, 2, 150000.00),
        ("Harmonica", "Instruments", 2.00, 15, 30.00),
        ("Kazoo", "Instruments", 1.00, 50, 300.00),
        ("Sectional Sofa", "Furniture", 2000.00, 8, 4000.00),
        ("Love Seat", "Furniture", 800.00, 12, 1600.00),
        ("Queen Size Mattress Frame", "Furniture", 95.00, 20, 190.00),
        ("15-inch Donglebook Pro", "Laptops", 3400.00, 3, 3400.00),
        ("3TB External SSD", "Laptop Accessories", 170.00, 12, 510.00),
        ("Donglebook Dongler", "Laptop Accessories", 75.00, 15, 225.00),
        ("Screen Cleaning Spray", "Laptop Accessories", 17.00, 30, 51.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES  ("Instruments", 10000.00),
        ("Furniture", 2000.00),
        ("Laptops", 1000.00),
        ("Laptop Accessories", 5000.00);