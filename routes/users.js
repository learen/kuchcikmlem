const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const config = require('config')

// @route POST api/users
// @desc Register a user
// @access Public

router.post('/', [
    check('nickname', 'Please add name').not().isEmpty(),
    check('password','Please enter a password with 6 or more characters').isLength({min: 6})
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()}) //lib exp-validator looking for errors
}
    const { nickname, password } = req.body; 

    try {
        let user = await User.findOne({ nickname });
        
        if(user){
            return res.status(400).json({msg: "User already exists"}); 
        }
        user = new User({
            nickname,
            password
        });
        const salt = await bcrypt.genSalt(10);  
        user.password = await bcrypt.hash(password, salt); //bcrypt hash pass
        await user.save();
        
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {  
            expiresIn: 360000
        }, (err,token) => {
            if(err) throw err;
            res.json({ token }); 
        } )

    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;