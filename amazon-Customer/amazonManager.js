var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_DB"
});

//connect to the DB and call the manage function
connection.connect(function (err) {
    if (err) throw err;
    manage();
});

//function displays the prompt menu for the manager options
function manage() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewInventory();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

//displays the current inventory for all items
function viewInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item #: " + res[i].item_id + " || Item: " + res[i].product_name + " || Price: $" + res[i].price.toFixed(2) + " || Quantity: " + res[i].stock);
        }
        console.log("-------");
        //call the manager menu function
        manage();
    });
}

//displays the item with an inventory count of less than 5
function lowInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("Item #: " + res[i].item_id + " || Item: " + res[i].product_name + " || Price: $" + res[i].price.toFixed(2) + " || Quantity: " + res[i].stock_quantity);
            }
        }
        console.log("-------");
        //call the manager menu function
        manage();
    });
}

function addInventory() {
    //display all items and current remaining stock_quantity
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item #: " + res[i].item_id + " || Item: " + res[i].product_name + " || Price: $" + res[i].price.toFixed(2) + " || Quantity: " + res[i].stock_quantity);
        }
        console.log("-------");

        //prompt the user to select the item and the amount of increase the inventory by
        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "Please select an item"
            }, 
            {
                name: "quantity",
                type: "input",
                message: "How many more to add to the inventory?"
            }])
            .then(function (answer) {
                connection.query("SELECT * from products WHERE ?", {
                    item_id: answer.item
                }, function (err, results) {
                    if (err) throw err;
                    var newStock = parseInt(results[0].stock_quantity) + parseInt(answer.quantity);
                    //update the inventory in the DB
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: newStock
                        },
                        {
                            item_id: answer.item
                        }],
                        function (error) {
                            if (error) throw err;
                        }
                        
                    );
                    //call the manager menu function
                    manage();
                })
            });
        
    }) 
}

//function to add a new product
function addProduct() {
    
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "Name of the product:"
    },
    {
        name: "price",
        type: "input",
        message: "What is the cost of the product:"
    },
    {
        name: "quantity",
        type: "input",
        message: "How much of the product is available:"
    },
    {
        name: "department",
        type: "input",
        message: "Product Deparment:"
    }]).then(function (answer) {
        connection.query("INSERT INTO products SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price,
          stock: answer.quantity
        },
        function(err) {
            if (err) throw err;
            console.log("New item successfully added");
            //call the manager menu function
            manage();
        });   
    });
}
