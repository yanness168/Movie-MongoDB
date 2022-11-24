const mongoose = require('mongoose');
// Define a schema
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},{
    versionKey: false // You should be aware of the outcome after set to false
});

let user = module.exports = mongoose.model('User',userSchema);