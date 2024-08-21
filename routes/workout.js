// Dependencies and Modules
const express = require("express");
const workoutController = require("../controllers/workout");
const { verify } = require("../auth");

// Routing Component
const router = express.Router();

// Route for creating a workout
router.post("/addWorkout", verify, workoutController.addWorkout); 

// Route for retrieving all workouts
router.get("/getMyWorkouts", verify, workoutController.getMyWorkouts);

// Route for updating workout info
router.patch("/updateWorkout/:workoutId", verify, workoutController.updateWorkout);

// Route to deleting a workout
router.delete("/deleteWorkout/:workoutId", verify, workoutController.deleteWorkout);

// Route to completing a workout
router.patch("/completeWorkoutStatus/:workoutId", verify, workoutController.completeWorkoutStatus);

// Route for retrieving all ACTIVE workouts
router.get("/active", workoutController.getAllActive);

// Route for retrieving single workout
router.get("/:workoutId", workoutController.getWorkout);


// Route to search for workouts by workout name
router.post('/search-by-name', workoutController.searchWorkoutsByName);

// Route to search workouts within a price range
router.post('/search-by-price', workoutController.searchWorkoutsByPrice);

/* START OF COMMENT

// Route to get emails of enrolled users
router.get('/:workoutId/enrolled-users', workoutController.getEmailsOfEnrolledUsers);

// Route to update enrollment status
router.put('/update-status', verify, verifyAdmin, workoutController.updateEnrollmentStatus);

END OF COMMENT*/


// Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;