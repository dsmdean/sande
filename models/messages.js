// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a Schema
var MessagesSchema = new Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversations',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: Boolean,
        default: false
    },
    company: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// create model
Messages = mongoose.model('Messages', MessagesSchema);

// export model
module.exports = Messages;