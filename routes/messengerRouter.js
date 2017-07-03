var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Conversations = require('../models/conversations');
var Messages = require('../models/messages');
var Companies = require('../models/companies');
var User = require('../models/users');
var Verify = require('./verify');

var messengerRouter = express.Router();
messengerRouter.use(bodyParser.json());

// View messages to and from authenticated user
messengerRouter.get('/user', Verify.verifyOrdinaryUser, function(req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversations.find({ user: req.decoded._id })
        // .select('_id')
        .populate('company')
        .exec(function(err, conversations) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            if (conversations.length === 0) {
                return res.status(200).json(conversations);
            }

            // Set up empty array to hold conversations + most recent message
            var fullConversations = [];
            conversations.forEach(function(conversation) {
                Messages.find({ 'conversation': conversation._id })
                    .sort('-createdAt')
                    .limit(1)
                    .exec(function(err, message) {
                        if (err) {
                            res.send({ error: err });
                            return next(err);
                        }

                        // conversation.message = message[0];
                        fullConversations.push({ _id: conversation._id, user: conversation.user, company: conversation.company, message: message[0] });
                        if (fullConversations.length === conversations.length) {
                            return res.status(200).json(fullConversations);
                        }
                    });
            });
        });
});

messengerRouter.get('/all', function(req, res, next) {
    // Only return one message from each conversation to display as snippet
    Messages.find({}, function(err, messages) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        return res.status(200).json(messages);
    });
});

// Start new conversation
messengerRouter.post('/new', Verify.verifyOrdinaryUser, function(req, res, next) {
    // if (!req.params.recipient) {
    //     res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
    //     return next();
    // }

    if (!req.body.composedMessage) {
        res.status(422).send({ error: 'Please enter a message.' });
        return next();
    }

    var conversation = new Conversations({
        user: req.body.user,
        company: req.body.company
    });

    conversation.save(function(err, newConversation) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        var message = new Messages({
            conversation: newConversation._id,
            body: req.body.composedMessage,
            user: req.body.author.user,
            company: req.body.author.company
        });

        message.save(function(err, newMessage) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id, newMessage: newMessage });
            // return next();
        });
    });
});

// GET/POST conversation
messengerRouter.route('/:conversationId')
    .all(Verify.verifyOrdinaryUser)
    // Retrieve single conversation
    .get(function(req, res, next) {
        Messages.find({ conversation: req.params.conversationId }, function(err, messages) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(200).json(messages);
        });
    })
    // Send reply in conversation
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        var reply = new Messages({
            conversation: req.params.conversationId,
            body: req.body.composedMessage,
            user: req.body.user,
            company: req.body.company
        });

        reply.save(function(err, sentReply) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(200).json({ message: 'Reply successfully sent!', reply: sentReply });
            // return (next);
        });
    });

// View messages to and from company
messengerRouter.get('/company/:companyId', Verify.verifyOrdinaryUser, function(req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversations.find({ company: req.params.companyId })
        // .select('_id')
        .populate('user')
        .exec(function(err, conversations) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            if (conversations.length === 0) {
                return res.status(200).json(conversations);
            }

            // Set up empty array to hold conversations + most recent message
            var fullConversations = [];
            conversations.forEach(function(conversation) {
                Messages.find({ 'conversation': conversation._id })
                    .sort('-createdAt')
                    .limit(1)
                    .exec(function(err, message) {
                        if (err) {
                            res.send({ error: err });
                            return next(err);
                        }

                        // conversation.message = message[0];
                        fullConversations.push({ _id: conversation._id, user: conversation.user, company: conversation.company, message: message[0] });
                        if (fullConversations.length === conversations.length) {
                            return res.status(200).json(fullConversations);
                        }
                    });
            });
        });
});

module.exports = messengerRouter;