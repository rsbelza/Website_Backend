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





// Blank ko muna yung sa mga google
/*router.get('/google', 
	passport.authenticate('google', {
		scope:['email', 'profile'],
	}
));

router.get('/google/callback', 
	passport.authenticate('google', {
		failureRedirect: '/user/failed',
	}),
	function (req, res) {
		res.redirect('/user/success')
	}
);

router.get("/failed", (req, res) => {
	console.log('User is not authenticated')
	res.send("Failed")
})

router.get("/success", isLoggedIn, (req, res) => {
	console.log('You are logged in')
	console.log(req.user)
	res.send(`Welcome ${req.user.displayName}`)
})

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log('Error while destroying session:', err)
		} else {
			req.logout(() => {
				console.log('You are logged out');
				res.redirect('/');
			})
		}
	})
})*/



module.exports = router;
