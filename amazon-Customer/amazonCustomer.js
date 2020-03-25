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

//connect to DB and call customer function
connection.connect(function (err) {
    if (err) throw err;
    customer();
});

//function displays the prompt menu for the customer options
function customer() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "View Products":
                    purchase();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

//the purchase function displays all available items. user then enters the item # and number of items
//they would like to purchase. If the inventory is less than the amount enter, the order will not be processed
function purchase() {
    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item #: " + res[i].item_id + " || Item: " + res[i].product_name + " || Price: $" + res[i].price.toFixed(2));
        }

        inquirer
            .prompt([{
                name: "item",
                type: "input",
                message: "Which item would you like to purchase?"
            }, {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?"
            }])
            .then(function (answer) {          

                connection.query("SELECT * from products WHERE ?", {
                    item_id: answer.item
                }, function (err, results) {
                    if (err) throw err;
                   
                    if (results[0].stock_quantity < answer.quantity) {
                        console.log("Insuffient Quantity. Order cannot be fulfilled");
                    } else {
                        var total = parseInt(results[0].price) * answer.quantity;
                        //display to the user the subtotal
                        console.log("Your order is being processed. The total amount is $" + total.toFixed(2));
                        var newStock = parseInt(results[0].stock_quantity) - answer.quantity;
                        var productTotal = parseInt(results[0].product_sales) + total;
                        //update the inventory and product sales once the order is placed
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [{
                                    stock_quantity: newStock,
                                    product_sales: productTotal
                                },
                                {
                                    item_id: answer.item
                                }
                            ],
                            //call menu function once order is complete
                            function (error) {
                                if (error) throw err;
                                customer();
                            }
                        );
                    }

                })

            });
    })
}
