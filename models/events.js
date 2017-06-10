// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a events Schema
var EventsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'Event'
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
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    creator: {
        type: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Companies'
        }
    },
    created: {
        type: String,
        required: true
    },
    // users: [{
    //     user: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Users'
    //     }
    // }],
    public: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// create model
Events = mongoose.model('Events', EventsSchema);

// export model
module.exports = Events;