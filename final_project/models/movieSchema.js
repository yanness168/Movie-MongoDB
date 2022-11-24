// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    posted_by: {
        type: String,
        required: true
    }
},{
    versionKey: false // You should be aware of the outcome after set to false
});

const movie = module.exports = mongoose.model('movie',movieSchema)