// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a invoice Schema
var InvoicesSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Companies',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    products: [{
        qty: {
            type: String,
            required: true
        },
        options: [{
            name: {
                type: String
            },
            option: {
                type: String
            }
        }],
        product: {
            type: String,
            required: true
        }
    }],
    subTotal: {
        type: Number
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {
    timestamps: true
});

// create model
Invoices = mongoose.model('Invoices', InvoicesSchema);

// export model
module.exports = Invoices;