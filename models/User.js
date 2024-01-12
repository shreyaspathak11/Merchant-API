const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        trim: true,
        minLength: [6, 'Your password must be at least 6 characters long'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Function to hash password before saving
userSchema.pre("save", async function (next) {                //pre save function for hashing password  
    if (this.isModified("password")) {                        //check if password is modified   
      this.password = await bcrypt.hash(this.password, 10);     //hash password using bcrypt
    }
  
    next();                                                   //call next function
  });
  
  
  // Function to match password
  userSchema.methods.matchPassword = async function (enteredPassword) {   //match password function
    try {
        return await bcrypt.compare(enteredPassword, this.password);    //compare password using bcrypt
    } catch (error) {
        throw error;
    }
};

  // Function to generate token
  userSchema.methods.generateToken = function () {                //generate token function
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);     //generate token using jsonwebtoken
  };

  
  module.exports = mongoose.model('User', userSchema);