/**
 * User Model
 */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid Email',
        },
    },

    name: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
    },

    role: {
        type: String,
        enum: ['Teacher', 'Student'],
        default: 'Student',
    },
});

// Statics Function to validate the logging of a user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Cannot find User');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid Username or Password');
    }

    return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
