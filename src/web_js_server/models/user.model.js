const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        addressX: {
            type: Number,
            required: true,
        },
        addressY: {
            type: Number,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'restaurant_owner'],
            default: 'user',
        },
        picture: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);