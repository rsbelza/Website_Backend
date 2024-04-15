const express = require("express");
const passport = require('passport');
const userController = require("../controllers/user");
const router = express.Router();
const {verify, verifyAdmin, isLoggedIn} = require("../auth");


//register uesr 
router.post("/register", userController.registerUser);

//login User
router.post("/login", userController.loginUser);

// set as admin
router.patch('/:userId/set-as-admin', verify, verifyAdmin, userController.setAdmin)

// Retrieve user details
router.get('/details', verify, userController.retrieveUser)

// Update password
router.patch('/update-password', verify, userController.updatePassword)

module.exports = router;
