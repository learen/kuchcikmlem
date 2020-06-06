const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @route GET api/recipes
// @desc GET all users recipes
// @access Private
router.get('/',auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({user: req.user.id}).sort({date: -1});
        res.json(recipes);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
// @route GET api/recipes/:id
// @desc GET one users recipe
// @access Private
router.get('/:id',auth, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        if(!recipe) return res.status(404).json({ msg: 'Recipe not found'})
        if(recipe.user.toString() !== req.user.id) {
            return  res.status(401).json({ msg: 'Not authorized'});
        }
        res.json(recipe);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
// @route POST api/recipe
// @desc Add new recipe
// @access Private
router.post('/', [auth,[
    check('name','Name is required').not().isEmpty()
]], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
    }
    const {name, time, servings, description, ingredients, photoURL } = req.body;
    try {
        const newRecipe = new Recipe({
            name,
            time,
            servings,
            description,
            ingredients,
            photoURL,
            user: req.user.id
        });
        const recipe = await newRecipe.save();
        res.json(recipe);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});
// @route PUT api/recipe/:id
// @desc Update recipe
// @access Private
router.put('/:id', auth, async (req, res) => {
    const { name, time, servings, description, ingredients, photoURL } = req.body;
    // Build contact object
    const recipeFields = {};
    if(name) recipeFields.name = name;
    if(time) recipeFields.time = time;
    if(servings) recipeFields.servings = servings;
    if(description) recipeFields.description = description;
    if(ingredients) recipeFields.ingredients = ingredients;
    if(photoURL) recipeFields.photoURL = photoURL;

    try {
        let recipe = await Recipe.findById(req.params.id);

        if(!recipe) return res.status(404).json({ msg: 'Recipe not found'})

        //Make sure user owns recipe
        if(recipe.user.toString() !== req.user.id) {
            return  res.status(401).json({ msg: 'Not authorized'});
        }
        recipe = await Recipe.findByIdAndUpdate(req.params.id,
            { $set: recipeFields },
            { new: true });

            res.json(recipe);
            
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error ');
    }
});
// @route DELETE api/recipes/:id
// @desc Delete recipe
// @access Private
router.delete('/:id', auth,  async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);

        if(!recipe) return res.status(404).json({ msg: 'Recipe not found'})

        //Make sure user owns recipe
        if(recipe.user.toString() !== req.user.id) {
            return  res.status(401).json({ msg: 'Not authorized'});
        }
        await Recipe.findByIdAndRemove(req.params.id);

            res.json({msg: "Recipe removed"});
            
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error 11');
    }
});
module.exports = router;