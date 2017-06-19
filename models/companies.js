// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a products Schema
var ProductsSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    images: [{
        type: String,
        default: 'default-company-image-300.jpg'
    }],
    options: [{
        name: {
            type: String
        },
        options: [{
            type: String
        }]
    }],
    price: {
        type: Number
    },
    stock: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//create a services Schema
var ServicesSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

//create a notifications Schema
var NotificationsSchema = new Schema({
    title: {
        type: String
    },
    route: {
        type: String
    }
}, {
    timestamps: true
});

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
        default: 'default-company-image-300.jpg'
    },
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    }],
    settings: {
        products: {
            type: Boolean,
            default: false
        },
        services: {
            type: Boolean,
            default: false
        }
    },
    products: [ProductsSchema],
    services: [ServicesSchema],
    // notifications: {
    //     amount: {
    //         type: Number,
    //         default: 0
    //     },
    //     notifications: [NotificationsSchema]
    // },
    notification: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// create model
Companies = mongoose.model('Companies', CompaniesSchema);

// export model
module.exports = Companies;