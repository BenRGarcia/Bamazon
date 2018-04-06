DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40) NOT NULL,
    department_name VARCHAR(40) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(40) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES  
	("Steinway Model D Concert Grand Piano", "instruments", 150000.00, 2, 150000.00),
    ("Harmonica", "instruments", 2.00, 15, 30.00),
    ("Kazoo", "instruments", 1.00, 50, 300.00),
    ("Sectional Sofa", "furniture", 2000.00, 8, 4000.00),
    ("Love Seat", "furniture", 800.00, 12, 1600.00),
    ("Queen Size Mattress Frame", "furniture", 95.00, 20, 190.00),
    ("15-inch Donglebook Pro", "laptops", 3400.00, 3, 3400.00),
    ("3TB External SSD", "laptop accessories", 170.00, 12, 510.00),
    ("Donglebook Dongler", "laptop accessories", 75.00, 15, 225.00),
    ("Screen Cleaning Spray", "laptop accessories", 17.00, 30, 51.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES  
	("instruments", 10000.00),
    ("furniture", 2000.00),
    ("laptops", 1000.00),
    ("laptop accessories", 5000.00);