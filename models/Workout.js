const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, 'User ID is required']
	},
    name: {
        type: String,
        required: [true, 'Workout Name is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required']
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
    
});

module.exports = mongoose.model('workout', workoutSchema);