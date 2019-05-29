DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(40) NOT NULL,
 department_name VARCHAR(40) NOT NULL,
 price DECIMAL(8,2) NOT NULL,
 stock_quantity INTEGER NOT NULL,
 PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('lightswitchA', 'electrical', 6.95, 102), ('lightswitchB', 'electrical', 9.95, 87), 
('outletA', 'electrical', 4.95, 222), ('sensorXYZ', 'electrical', 19.95, 59), 
('windowX', 'millwork', 49.95, 72), ('windowY', 'millwork', 59.95, 33), 
('windowZ', 'millwork', 79.95, 90), ('doorP', 'millwork', 99.95, 22), 
('doorQ', 'millwork', 159.00, 17), ('hinge1', 'hardware', 2.95, 44), 
('knob1', 'hardware', 2.95, 46), ('knob2', 'hardware', 1.95, 84),
('wrench7', 'tools', 17.95, 16), ('wrench9', 'tools', 7.95, 153),
('handsaw', 'tools', 12.95, 47), ('bowsaw', 'garden', 14.95, 31),
('hoe', 'garden', 9.95, 19), ('spigot', 'garden', 4.95, 11);

SELECT * FROM products;

SELECT product_name, department_name, price FROM products;
SELECT * FROM products WHERE price<50;
SELECT * FROM products WHERE price>50;


SELECT price FROM products WHERE ?, [{item_id : itemOneId}]
SELECT product_name FROM products WHERE ?, [{item_id : itemOneId}]
SELECT stock_quantity FROM products WHERE ?, [{item_id : itemOneId}]
UPDATE products SET ? WHERE ?, [{stock_quantity: newStockQuantity}, {item_id: itemOneId}]
