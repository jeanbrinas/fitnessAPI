// Dependencies and Modules
const Workout = require("../models/Workout");
const User = require("../models/User");
const { errorHandler } = require('../auth');

// Create a workout

    // Steps: 
    // 1. Instantiate a new object using the Workout model and the request body data
    // 2. Save the record in the database using the mongoose method "save"
    // 3. Use the "then" method to send a response back to the client appliction based on the result of the "save" method

module.exports.addWorkout = (req, res) => {

    // Creates a variable "newWorkout" and instantiates a new "Workout" object using the mongoose model
    // Uses the information from the request body to provide all the necessary information
    let newWorkout = new Workout({
        name : req.body.name,
        duration : req.body.duration,
        status : req.body.status,
        userId: req.user.id
    });

    Workout.findOne({name: req.body.name})
    .then(existingWorkout => {
        // If workout exists, return true
        if(existingWorkout) {
            return res.status(409).send({ error: 'Workout already exists'})
        } else {
            // Saves the created object to our database
            return newWorkout.save()
            .then(result => res.status(201).send(result))
            .catch(err => errorHandler(err, req, res));
        }
    })
    .catch(err => errorHandler(err, req, res));    
}; 

// module.exports.addWorkout = (req, res) => {

//     try {
//         let newWorkout = new Workout({
//             name : reqBody.name,
//             description : req.body.description,
//             price : req.body.price
//         });

//         return newWorkout.save()
//         .then(result => res.send(result))
//         .catch(err => res.send(err))

//     } catch (err) {
//         console.log(err);
//         res.send("Error in variables");
//     }
// }


// Retrieve all workouts

    // Steps: 
    // 1. Retrieve all workouts using the mongoose "find" method
    // 2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method

module.exports.getMyWorkouts = (req, res) => {

    return Workout.find({})
    .then(result => {
        // if the result is not null send status 200 and its result
        if (result.length > 0){
            return res.status(200).send({
                workouts: result
            });
        }
        else {
            // 404 for not found workouts
            return res.status(404).send({ error: 'No workouts found' });
        }
    })
    .catch(err => errorHandler(err, req, res));

};

// Update a workout

    // Steps: 
    // 1. Create an object containing the data from the request body
    // 2. Retrieve and update a workout using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the workout
    // 3. Use the "then" method to send a response back to the client appliction based on the result of the "find" method

module.exports.updateWorkout = (req, res)=>{

    let updatedWorkout = {
        name : req.body.name,
        duration : req.body.duration,
        status : req.body.status,
        userId: req.user.id
    }

    // findByIdandUpdate() finds the the document in the db and updates it automatically
    // req.body is used to retrieve data from the request body, commonly through form submission
    // req.params is used to retrieve data from the request parameters or the url
    // req.params.workoutId - the id used as the reference to find the document in the db retrieved from the url
    // updatedWorkout - the updates to be made in the document
    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout, { new: true })
    .then(workout => {
        if (workout) {
            res.status(200).send({ 
                // success: true,
                message: 'Workout updated successfully',
                updatedWorkout: workout
            });
        } else {
            res.status(404).send({ error: 'Workout not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


// Archive a workout

    // Steps: 
    // 1. Create an object and with the keys to be updated in the record
    // 2. Retrieve and update a workout using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the workout
    // 3. If a workout is updated send a response of "true" else send "false"
    // 4. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method

module.exports.deleteWorkout = (req, res) => {

    return Workout.findByIdAndDelete(req.params.workoutId)
    .then(workout => {
        // Check if a workout was found
        if (workout) {
            // If workout found, check if it was already archived
            if (!workout) {
                // If workout already archived, return a 200 status with a message indicating "workout already deleted".
                return res.status(200).send({
                    message: 'Workout already deleted',
                    // workout: workout
                });
            }
            //if the workout is successfully deleted, return true and send a message 'Workout deleted successfully'.
            return res.status(200).send({
                // success: true, 
                message: 'Workout deleted successfully'
            });
        } else {
            // if the workout is not found, return 'Workout not found'
            return res.status(404).send({ message: 'Workout not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Activate a workout

    // Steps: 
    // 1. Create an object and with the keys to be updated in the record
    // 2. Retrieve and update a workout using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the workout
    // 3. If the user is an admin, update a workout else send a response of "false"
    // 4. If a workout is updated send a response of "true" else send "false"
    // 5. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method

module.exports.completeWorkoutStatus = (req, res) => {

    let updateStatusField = {
        status: "completed"
    }
    
    return Workout.findByIdAndUpdate(req.params.workoutId, updateStatusField, {new: true })
    .then(workout => {
        // Check if a workout was found
        if (workout) {
            // If workout found, check if it was already activated
            if (workout.status) {
                // If workout already activated, return a 200 status with a message indicating "Workout already activated".
                return res.status(200).send({
                    message: 'Workout already completed'
                    // workout: workout
                });
            }
            // If workout not yet activated, return a 200 status with a boolean true.
            return res.status(200).send({
                // success: true,
                message: 'Workout status updated successfully',
                updatedWorkout: workout
            });
        } else {
            // If workout not found, return a 404 status with a boolean false.
            return res.status(404).send({ message: 'Workout not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};



// Retrieve all active workouts

    // Steps: 
    // 1. Retrieve all workouts using the mongoose "find" method with the "isActive" field values equal to "true"
    // 2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method

module.exports.getAllActive = (req, res) => {

    return Workout.find({ isActive: true })
    .then(result => {

        if(result.length > 0){           
            return res.status(200).send({
                workouts: result
            });
        } else {
            return res.status(404).send({ message: 'No active workouts found' });
        }
    })
    .catch(err => errorHandler(err, req, res));
};

// Retrieve single workout

    // Steps: 
    // 1. Retrieve a workout using the mongoose "findById" method
    // 2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method


module.exports.getWorkout = (req, res) => {
    
    return Workout.findById(req.params.workoutId)
    .then(workout => {
        if(workout) {
            return res.status(200).send({
                workout: workout
            });
        } else {
            return res.status(404).send({ error: 'Workout not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};


// Controller action to search for workouts by workout name
module.exports.searchWorkoutsByName = async (req, res) => {
    const { workoutName } = req.body;

    if (workoutName === undefined) {
        return res.status(400).json({ error: 'workoutName is required' });
    }
    try {

        // Use a regular expression to perform a case-insensitive search
        const workouts = await Workout.find({
            name: { $regex: workoutName, $options: 'i' }
        });

        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller action to search for workouts by price range

module.exports.searchWorkoutsByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.body;

    if (minPrice === undefined || maxPrice === undefined) {
        return res.status(400).json({ error: 'minPrice and maxPrice are required' });
    }

    try {
        const workouts = await Workout.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

/* START OF COMMENT

module.exports.getEmailsOfEnrolledUsers = async (req, res) => {
    const workoutId = req.params.workoutId; // Use req.params.workoutId since it's in the route parameter

    try {
        // Find all enrollments for the given workoutId
        const enrollments = await Enrollment.find({ 'enrolledWorkouts.workoutId': workoutId });

        console.log(enrollments);

        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ message: 'No users enrolled in this workout' });
        }

        // Get the userIds of enrolled users for the specific workout
        const userIds = enrollments.map(enrollment => enrollment.userId);

        // Find the users with matching userIds
        const enrolledUsers = await User.find({ _id: { $in: userIds } }); // Use userIds instead of undefined variable 'users'

        console.log(enrolledUsers);
        
        // Extract the emails from the enrolled users
        const emails = enrolledUsers.map(user => user.email); // Use map instead of forEach

        res.status(200).json({ userEmails: emails }); // Correct variable name userEmails, and include it in the response
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while retrieving enrolled users' });
    }
};


module.exports.updateEnrollmentStatus = async (req, res) => {
    const { userId, enrolledWorkouts, status } = req.body;

    // Validate input
    if (!userId || !enrolledWorkouts || !status) {
        return res.status(400).json({ message: 'User ID, Workout ID, and status are required.' });
    }

    // Check if status is valid
    const validStatuses = ['enrolled', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
    }

    try {
        // Find the enrollment document
        let enrollment = await Enrollment.findOne({ userId, enrolledWorkouts });

        if (!enrollment) {
            // If no enrollment exists, create a new one
            enrollment = new Enrollment({ userId, enrolledWorkouts, status });
        } else {
            // Update the status if enrollment exists
            enrollment.status = status;
        }

        // Save the enrollment document
        await enrollment.save();

        res.status(200).json({ message: 'Enrollment status updated successfully.', enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error });
    }
};

END OF COMMENT*/