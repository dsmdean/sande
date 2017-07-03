// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a Schema
var ConversationsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Companies'
    }
});

// create model
Conversations = mongoose.model('Conversations', ConversationsSchema);

// export model
module.exports = Conversations;