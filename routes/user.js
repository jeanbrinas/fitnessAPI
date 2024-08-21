const express = require('express');
const userController = require("../controllers/user");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");
// const passport = require("passport");

// Routing component
const router = express.Router();

// Routes will be placed here

// Route for user registration
router.post("/register", userController.registerUser);

// Route for user login
router.post("/login", userController.loginUser);

// Route for retrieving user details
router.get("/details", verify, userController.getProfile);

// Route for Updating User As Admin
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.updateUserAsAdmin);

// Route for updating the password
router.patch('/update-password', verify, userController.resetPassword);

/*// Routes for Google Login

// Route for initiating the Google OAuth consent screen
router.get("/google", 

	passport.authenticate('google', {
		// Scopes that are allowed when retriving user data
		scope: ['email', 'profile'],
		// Allows the OAuth consent screen to be "prompted" when the route is accessed to select a new account every time the user tries to login.
		// prompt: "select_account"
	})
)

// Route for the callback URL for Google OAuth authentication
router.get("/google/callback",
	passport.authenticate('google', {
		// If authentication is unsuccessful, redirect to "/users/failed" route
		failureRedirect: '/users/failed',
	}),
	// If authentication is successful, redirect to "/users/success" route
	function (req, res) {
		res.redirect('/users/success')
	}
)
*/

// Route for failed authentication
router.get("/failed", (req, res) => {
	console.log('User is not authenticated');
	res.send("Failed")
})

// Route for successful authentication
router.get("/success", isLoggedIn, (req, res) => {
	console.log('You are logged in');
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`)
})


// Route for logging out
router.get("/logout", (req, res) => {
	// Destroys the session that stores the Google OAuth Client credentials
    // Allows for release of resources when the account information is no longer needed in the browser
	req.session.destroy(err => {
		if(err) {
			console.log('Error while destroying the session: ', err)
		} else {
			req.logout(() => {
				console.log('You are logged out');
				res.redirect('/')
			})
		}
	})
})


/* START COMMENT
// Route for duplicate email
router.post("/check-email", userController.checkEmailExists);

// Route to enroll a user
router.post("/enroll", verify, userController.enroll);

// Route to get the user's enrollements array
router.get('/get-enrollments', verify, userController.getEnrollments);



// Route for updating user profile route
router.put('/profile', verify, userController.updateProfile);
END COMMENT */

module.exports = router;