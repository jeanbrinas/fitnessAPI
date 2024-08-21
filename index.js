const express = require("express");
const mongoose = require("mongoose");

// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");
require('dotenv').config();

//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

// Environment setup
// const port = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const corsOptions = {
	//client/Frontend application URL
	// Allow requests from this origin (The client's URL) the origin is in array form if there are multiple origins.
	origin: ['http://localhost:3000'],
	// Allow only specified headers // optional only if you want to restrict the headers
    //allowedHeaders: ['Content-Type', 'Authorization'], 
	credentials: true,
	// Allow only specified HTTP methods // optional only if you want to restrict the methods
	// methods: ['GET', 'POST']
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};