const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    nickname:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema)