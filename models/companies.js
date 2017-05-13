// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a companies Schema
var CompaniesSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyCategories'
    },
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    location: {
        address: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        province: {
            type: String,
            default: ''
        }
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: 'default-user-image-159.png'
    },
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    }]
}, {
    timestamps: true
});

// create model
Companies = mongoose.model('Companies', CompaniesSchema);

// export model
module.exports = Companies;