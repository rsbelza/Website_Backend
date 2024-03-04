// Setup the dependencies
// require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport")
const session = require('express-session');

// const cartRoutes = require("./routes/cart");
// const productRoute = require("./routes/product");
// const orderRoutes = require("./routes/order");
const userRoute = require("./routes/user");

// require("./passport");
// Server setup
const app = express();
const port = 4000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//google logIn
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())
// Mongoose Connection
mongoose.connect("mongodb+srv://daveoyangorin:admin1234@batch364.njbbrbz.mongodb.net/");

let db = mongoose.connection;

// Error in connection
db.on("error", console.error.bind(console, "Connection Error!"));

// Once opened
db.once("open", () => console.log("We're connected to the cloud database!"))

//post route
// app.use("/order" , orderRoutes);
// app.use("/product" , productRoute);
// app.use("/cart" , cartRoutes);
app.use("/user" , userRoute);
// Server listening
if(require.main === module){
	app.listen(port, () => console.log(`Server running at port ${port}`));
}


module.exports = { app, mongoose };