# bamazon
A shopping app -- this is a simple app to place an order from the products in the bamazon database.

--------------------------------------------------

### To run bamazon: 
In the command line, from the "bamazon" folder, just type "node bamazonCustomer" (case sensitive), then hit 'Enter'.
> $ node bamazonCustomer

When bamazon loads, you will see a list of the current products available. You will be asked to enter the product-id number for the item you wish to purchase,and then you will be asked to enter the quantity.

>  ?  Please enter the item-ID of the product you would like:

>  ? Please enter the quantity you would like:


Then bamazon will check the inventory levels, to see if your item is in stock. If there is insufficient supply to fill your order, you will be given the option to modify the quantity or to choose another item. 

>  ? Do you want to modify the quantity, choose a different item or quit? 
>    (Use arrow keys)
>    CHANGE-QUANTITY
>    CHANGE-ITEM
>    QUIT

When your order is complete, you will see a an order summary that includes a subtotal for your purchase.
----------------------------------------------------

### Required npm packages
These npm packages need to be installed in order to run bamazon:
 mysql / inquirer / console.table 

Use these commands to install the packages:
> $ npm install mysql

> $ npm install inquirer

> $ npm install console.table

-----------------------------------------------------

### Some screenshots of bamazon in action

This is the bamazon welcome and product list:

![bamazon welcome](images/bamazon-welcome.png)


This shows a summary of a successfully placed order:
(also note the update of the quantity in the database)

![bamazon order summary](images/successful-order.png)


This shows your options if inventory is too low for your order:

![bamazon options 1](images/insufficient-inventory.png)


This shows your options if an item is out of stock:

![bamazon options 2](images/outofstock.jpg)

