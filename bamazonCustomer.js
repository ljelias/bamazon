var mysql = require("mysql");
var inquirer = require ('inquirer');
var tabler = require("console.table");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazonDB'
}); 

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    
    console.log(`
    =========================
    > WELCOME TO BAMAZON!!! <
    =========================`);
    displayProductList();
});

let itemOneId;
let itemOneQuantity = 0;
let stockQuantity = 0;
let itemOrdered = "";
let itemPrice = 0;
let totalPrice = 0;


function displayProductList() {
    console.log(`
    > Our current products: 
    =========================`);

    connection.query('SELECT * FROM products', function (error, results) {
        if (error) throw error;
        console.table(results);
        promptItemChoice();
    });
}

//ask customer to choose an item
function promptItemChoice() {
    inquirer.prompt([ 
        {
        type: "input",
        message: "Please enter the item-ID of the product you would like: ",
        name: "itemId"
        }
    ])
    .then(function(inquirerResponse1) {
      if (inquirerResponse1.itemId > 0) {
        console.log("You have selected item: " + inquirerResponse1.itemId + ".\n");
        itemOneId = inquirerResponse1.itemId;
        promptItemQuantity(); 
      }
      else {
        console.log(`You have not entered a valid item-ID.`);
        retryItemChoice();
      }
    });
}

function retryItemChoice() {
    inquirer.prompt([
        {
        type: "list",
        message: "Do you want to try again or quit?",
        choices: ["TRY-ID-AGAIN", "QUIT"],
        name: "tryIdAgain"
        }
    ])
    .then(function(inquirerResponse2) {
        if (inquirerResponse2.tryIdAgain == "TRY-ID-AGAIN") {
          promptItemChoice(); 
        }
        if (inquirerResponse2.tryIdAgain == "QUIT") {
          console.log("The transaction has been canceled. Bye!");
          connection.end();
        }
    });
}

//ask customer for the quantity of the item
function promptItemQuantity() {
    inquirer.prompt([ 
        {
        type: "number",
        message: "Please enter the quantity you would like: ",
        name: "quantity"
        }
    ])
    .then(function(inquirerResponse3) {
      if (inquirerResponse3.quantity > 0) {
        console.log("Your quantity is: " + inquirerResponse3.quantity + ".\n");
        itemOneQuantity = parseInt(inquirerResponse3.quantity);
        console.log(`
>> Checking inventory... 
================================\n`);
        inventoryChecker(); 
      }
      else  {
        console.log(`\nYou did not enter a quantity.\n`);
        retryItemQuantity();
      }
    });
}

function retryItemQuantity() {
    inquirer.prompt([
        {
        type: "list",
        message: "Do you want to try again or quit?",
        choices: ["TRY-QUANTITY-AGAIN", "QUIT"],
        name: "tryQtyAgain"
        }
    ])
    .then(function(inquirerResponse4) {
        if (inquirerResponse4.tryQtyAgain == "TRY-QUANTITY-AGAIN") {
          promptItemQuantity(); 
        }
        if (inquirerResponse4.tryQtyAgain == "QUIT") {
          console.log("Transaction has been canceled. Bye!");
          connection.end();
        }
    });
}



function inventoryChecker() {
    //check inventory in DB
    connection.query('SELECT stock_quantity FROM products WHERE ?', [{item_id : itemOneId}], function(error, quantityResult){
        if(error) throw error;
        stockQuantity = parseInt(quantityResult[0].stock_quantity); // res: [ RowDataPacket { stock_quantity: 102 } ]
        //console.log(stockQuantity);
        if(stockQuantity == undefined){
          console.log('Sorry, no items were found with item-ID: ' +  itemOneId);
        }
        else if (stockQuantity === 0) {
          console.log('Sorry, this item is out of stock.\n');
          noInventoryOptions();
        }
        else if (stockQuantity >= itemOneQuantity) {
          console.log('Your item is in stock!');
          orderProcessor();
        }
        else {
        console.log(`
    \n================================
    \nOur apologies! Our inventory is
    \ntoo low to complete your order.
    \nTotal available is: ${stockQuantity}.
    \n================================`);
        lowInventoryOptions();
        }
    });
}

//give customer the option to change quantity, start over, or quit if stock is insufficient
function lowInventoryOptions() {
    inquirer.prompt([
        {
        type: "list",
        message: "Do you want to modify the quantity, choose a different item or quit?",
        choices: ["CHANGE-QUANTITY", "CHANGE-ITEM", "QUIT"],
        name: "retryOptions"
        }
    ])
    .then(function(inquirerResponse5) {
        if (inquirerResponse5.retryOptions == "CHANGE-QUANTITY") {
            console.log(">>>>>>>>>>>>");
            promptItemQuantity(); 
        }
        if (inquirerResponse5.retryOptions == "CHANGE-ITEM") {
            console.log(">>>>>>>>>>>>");
            displayProductList(); 
        }
        if (inquirerResponse5.retryOptions == "QUIT") {
            console.log("Transaction has been canceled. Bye!");
            connection.end();
        }
    });
}

//give customer options if the item is out of stock
function noInventoryOptions() {
    inquirer.prompt([
        {
        type: "list",
        message: "Do you want to choose a new item or quit?",
        choices: ["NEW-ITEM", "QUIT"],
        name: "startAgain"
        }
    ])
    .then(function(inquirerResponse6) {
        if (inquirerResponse6.startAgain == "NEW-ITEM") {
          displayProductList(); 
        }
        if (inquirerResponse6.startAgain == "QUIT") {
          console.log("Thank you. Bye!");
          connection.end();
        }
    });
}

function orderProcessor() {

    console.log("\n======ORDER SUMMARY======")

    connection.query('SELECT product_name FROM products WHERE ?', [{item_id : itemOneId}], function(error, itemName){
        if(error) throw error;
        //console.log(itemName);
        itemOrdered = itemName[0].product_name;
        console.log('Item ordered: ' + itemOrdered);
    });
    connection.query('SELECT price FROM products WHERE ?', [{item_id : itemOneId}], function(error, priceResult){
        if(error) throw error;
        //console.log(priceResult)
        itemPrice = priceResult[0].price;
        console.log('Item price: ' + itemPrice.toFixed(2));
        console.log('Quantity ordered: ' + itemOneQuantity);

        totalPrice = itemPrice * itemOneQuantity;
        console.log('ORDER SUBTOTAL: ' + totalPrice.toFixed(2));

        dbQuantityUpdate();
    });
}

//after order is complete, update the quantity in the database
function dbQuantityUpdate() {   
    let newStockQuantity;

    connection.query('SELECT stock_quantity FROM products WHERE ?', [{item_id : itemOneId}], function(error, quantityResult){
        if(error) throw error;
        stockQuantity = parseInt(quantityResult[0].stock_quantity);
        newStockQuantity = stockQuantity - itemOneQuantity;
        //console.log(newStockQuantity);
        connection.query('UPDATE products SET ? WHERE ?', [{stock_quantity: newStockQuantity}, {item_id: itemOneId}], function(err, res) {
            connection.query('SELECT stock_quantity FROM products WHERE ?', [{item_id : itemOneId}], function(error, quantityResult){
                console.log("\n\n\nUpdated quantity for this item in database: " + quantityResult[0].stock_quantity);
                connection.end();

            });  
        });
    });

}



