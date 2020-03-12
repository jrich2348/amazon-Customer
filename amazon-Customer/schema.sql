DROP DATABASE IF EXISTS amazon;
CREATE DATABASE amazon;

USE amazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Black Ops", "Video Games", 49.95, 150),
  ("DESTINY", "Video Games", 59.99, 200),
  ("CHICK FIL A", "Food and Drink", 24.50, 50),
  ("GUCCI", "Apparel", 75.00, 5),
  ("LEVIS", "Apparel", 54.25, 35),
  ("PH WATER", "Necessities", 42.42, 42),
  ("MAN OF WAR", "Films", 15.00, 25),
  ("RAY", "Films", 25.50, 57),
  ("SORRY", "Board Games", 30.50, 35),
  ("CONNECT FOUR", "Board Games", 19.95, 23);

 CREATE TABLE departments(
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  primary key(department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Video Games", 200),
  ("Food and Drink", 100),
  ("Apparel", 50),
  ("Necessities", 300),
  ("Films", 35),
  ("Board Games", 0);
