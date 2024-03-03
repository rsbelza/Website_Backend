const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.']
    },
    
    lastName: {
        type: String,
        required: [true, 'Last name is required.']
    },

    email: {
        type: String,
        required: [true, 'Email address is required.']
    },

    password: {
        type: String,
        required: [true, 'Password is required.']
    },

    isAdmin: {
        type: Boolean,
        required: [false]
    },

    mobileNo: {
        type: Number,
        required: [true, 'Mobile number is required.']
    }
    
})

module.exports = mongoose.model("Users", userSchema)