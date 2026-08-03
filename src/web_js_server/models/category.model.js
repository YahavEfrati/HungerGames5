const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        icon: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);

const INITIAL_CATEGORIES = [
    { name: 'Fast Food', icon: '🍔' },
    { name: 'Asian', icon: '🍜' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Meat', icon: '🍖' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Other', icon: '🍽️' },
];

async function seedCategories() {
    const count = await Category.countDocuments();
    // If there are no categories in the database, seed the initial categories.
    if (count === 0) {
        await Category.insertMany(INITIAL_CATEGORIES);
    }
}

module.exports = {Category, seedCategories,};