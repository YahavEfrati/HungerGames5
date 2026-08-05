const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
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
        phone: {
            type: String,
            trim: true,
        },
        kosher: {
            type: Boolean,
            default: false,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        working_hours: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
        },
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
            },
        ],
        minimumOrder: {
            type: Number,
            default: 15,
            min: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model('Restaurant', restaurantSchema);