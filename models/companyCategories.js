// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a companies categories Schema
var CompanyCategoriesSchema = new Schema({
    category: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
});

// create model
CompanyCategories = mongoose.model('CompanyCategories', CompanyCategoriesSchema);

// export model
module.exports = CompanyCategories;