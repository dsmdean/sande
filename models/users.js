// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

//create a users Schema
var Users = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: {
        type: String,
        default: ''
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    suspended: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// create model
Users.plugin(passportLocalMongoose);

// export model
module.exports = mongoose.model('Users', Users);