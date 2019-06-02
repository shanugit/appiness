/**
 * Defining the user Schema. The structure in which we are expecting the data to be inserted from login Page.
 * Only two filds I am taking for user entry in my local DB.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//== Defining the Schema ===//
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},{
    timestamps: true
});

//== Creatinh the User model for MongoDB ==//
const User = mongoose.model("User", userSchema);

//== Exporting the Model ==//
module.exports = User;