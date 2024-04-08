// Setup the dependencies
// require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport")
const multer = require('multer');
const session = require('express-session');

const cartRoutes = require("./routes/cart");
const productRoute = require("./routes/product");
const orderRoutes = require("./routes/order");
const userRoute = require("./routes/user");

// require("./passport");
// Server setup
const app = express();
const port = 4007;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
//google logIn
// app.use(session({
// 	secret: process.env.clientSecret,
// 	resave: false,
// 	saveUninitialized: false
// }));

app.use(passport.initialize());
// app.use(passport.session())
// Mongoose Connection
mongoose.connect("mongodb+srv://rsbelza:admin1234@cluster0.9orcdgp.mongodb.net/capstone2?retryWrites=true&w=majority");

let db = mongoose.connection;

// Error in connection
db.on("error", console.error.bind(console, "Connection Error!"));

// Once opened
db.once("open", () => console.log("We're connected to the cloud database!"))

//post route
app.use("/b7/orders" , orderRoutes);
app.use("/b7/products" , productRoute);
app.use("/b7/cart" , cartRoutes);
app.use("/b7/users" , userRoute);
// Server listening
if(require.main === module){
	app.listen(port, () => console.log(`Server running at port ${port}`));
}


module.exports = { app, mongoose };