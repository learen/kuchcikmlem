const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    name:{
        type: String,
        required: true
    },
    time:{
        type: Number
    },
    servings:{
        type: Number
    },
    description: {
        type: String
    },
    ingredients: {
        type: Array
    },
    photoURL: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('recipe', RecipeSchema)