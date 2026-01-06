const express = require("express");
const user = require("./Router/user");
const antique_coins = require("./Router/antique_coins");
const cors = require('cors');
const path = require('path');
const add_cart = require("./Router/add_cart")


const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'uploads/coins')));
app.use(express.static(path.join(__dirname, 'uploads/profiles')));

app.use(express.json());
app.use("/auth", user);
app.use("/app/coin", antique_coins);
app.use("/app/cart", add_cart);


app.listen(3001, () => {
  console.log("connection successfully");
});
