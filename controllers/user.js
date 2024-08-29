const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require('../auth')
const { errorHandler } = auth;


//User registration
/*
    Steps:
    1. Create a new User object using the mongoose model and the information from the request body
    2. Make sure that the password is encrypted
    3. Save the new User to the database
*/
module.exports.registerUser = (req, res) => {

	// Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({ error: 'Email invalid' });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ error: 'Password must be atleast 8 characters' });
    
    // If all needed requirements are achieved
    } else {

		// Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
	    // Uses the information from the request body to provide all the necessary information
		let newUser = new User({
			firstName: req.body.firstName,
			lastName:  req.body.lastName,
			email:  req.body.email,
			// 10 salt rounds
			password: bcrypt.hashSync( req.body.password, 10)
		})
		// Saves the created user to our database
		return newUser.save()
		.then((result) => res.status(201).send({ message: 'Registered Successfully'}))
		.catch(err => errorHandler(err, req, res));	
	}
}


// User authentication
/*
    Steps:
    1. Check the database if the user email exists
    2. Compare the password provided in the login form with the password stored in the database
    3. Generate/return a JSON web token if the user is successfully logged in and return false if not
*/
module.exports.loginUser = (req, res) => {

	if(req.body.email.includes("@")){
		return User.findOne({email:  req.body.email})
		.then(result => {

			// User does not exist
			if(result === null) {

				return res.status(404).send({ error: 'No email found' });

			//If user exists
			} else {

				// Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
	            // The "compareSync" method is used to compare a non encrypted password from the login form to the encrypted password retrieved from the database and returns "true" or "false" value depending on the result
				const isPasswordCorrect = bcrypt.compareSync( req.body.password, result.password);

				if (isPasswordCorrect) {

					// Generates an access token
	                // Uses the "createAccessToken" method defined in the "auth.js" file
					return res.status(200).send({ 
						// message: 'User logged in successfully',
						access: auth.createAccessToken(result)
					});

				// Passwords do not match
				} else {
					return res.status(401).send({ error: 'Email and password do not match' });
				}
			}
		})
		.catch(err => errorHandler(err, req, res));
	} else {
		return res.status(400).send({ error: 'Invalid email' })
	}
}

// Retrieve user details
/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
module.exports.getProfile = (req, res) => {
	// console.log(reqBody)
    return User.findById(req.user.id)
    .then(user => {

    	if(!user) {
    		// if no user is found, send a message 'User not found'.
            return res.status(404).send({ error: 'User not found' })

        // if the user is found, return the user.
    	} else {
	        user.password = "";
	        return res.status(200).send({ user: user });   		
    	}
    })
    .catch(err => errorHandler(err, req, res));
};


// Controller function for admin user to update another user
module.exports.updateUserAsAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
            	message: 'User not found'
            });
        }

        user.isAdmin = true;
        await user.save();

        return res.status(200).json({ updatedUser: user });
    } catch (error) {
        return res.status(500).json({ 
        	error: 'Failed in Find', 
        	details: error });
    }
};


// Function to reset the password
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




/*
// Check if the email already exists

    // Steps: 
    // 1. Use mongoose "find" method to find duplicate emails
    // 2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method

module.exports.checkEmailExists = (req, res) => {

	if (req.body.email.includes("@")){

		// The result is sent back to the client via the "then" method found in the route file
		return User.find({ email : req.body.email })
		.then(result => {

		    // The "find" method returns a record if a match is found
		    if (result.length > 0) {

		        return res.status(409).send({ message: 'Duplicate email found'});

		    // No duplicate email found
		    // The user is not yet registered in the database
		    } else {

		        return res.status(404).send({ message: 'No duplicate email found'});
		    };
		})
		.catch(err => errorHandler(err, req, res));

	} else {
		res.status(400).send({ message: 'Invalid email format'})
	}
};

// Enroll a user to a course
module.exports.enroll = (req, res) => {

	if(req.user.isAdmin) {
		return res.status(403).send({ message: 'Admin is forbidden' });
	}

	let newEnrollment = new Enrollment({
		userId: req.user.id,
		enrolledCourses: req.body.enrolledCourses,
		totalPrice: req.body.totalPrice
	})

	return newEnrollment.save()
	.then(enrolled => {
		return res.status(201).send({
			success: true,
			message: 'Enrolled successfully'
		});
	})
	.catch(err => errorHandler(err, req, res));
}

// s46 Activity: Get enrollments

    // Steps:
    // 1. Use the mongoose method "find" to retrieve all enrollments for the logged in user
    // 2. If no enrollments are found, return a 404 error. Else return a 200 status and the enrollment record

module.exports.getEnrollments = (req, res) => {
    return Enrollment.find({userId : req.user.id})
        .then(enrollments => {
            if (enrollments.length > 0) {
                return res.status(200).send(enrollments);
            }
            // if there is no enrolled courses, send a message 'No enrolled courses'.
            return res.status(404).send({ message: 'No enrolled courses' });
        })
        .catch(error => errorHandler(error, req, res));
};


// Controller function to update the user profile
module.exports.updateProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}

*/