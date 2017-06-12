var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Events = require('../models/events');
var User = require('../models/users');
var Verify = require('./verify');

var eventsRouter = express.Router();
eventsRouter.use(bodyParser.json());

// GET/DELETE all events - POST event
eventsRouter.route('/')
    .get(function(req, res, next) {
        Events.find({}, function(err, events) {
            if (err) next(err);
            res.json(events);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Events.create(req.body, function(err, event) {
            if (err) next(err);

            res.json({ success: true, status: 'Successfully created the event: ' + event.name, event: event });
        });
    })
    .delete(function(req, res, next) {
        Events.remove({}, function(err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

// GET/DELETE all events - POST event
eventsRouter.route('/company/:companyId')
    .get(function(req, res, next) {
        Events.find({ created: req.params.companyId })
            .populate('creator.company')
            .exec(function(err, events) {
                if (err) next(err);
                res.json(events);
            });
    });

// GET - PUT - DELETE event by id
eventsRouter.route('/:eventId')
    .get(function(req, res, next) {
        Events.findById(req.params.eventId, function(err, event) {
            if (err) next(err);
            res.json(event);
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Events.findByIdAndUpdate(req.params.eventId, {
            $set: req.body
        }, {
            new: true
        }, function(err, event) {
            if (err) next(err);
            res.json({ status: "You've successfully edited the event!", event: event });
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Events.remove({ _id: req.params.eventId }, function(err, resp) {
            if (err) next(err);

            res.json({ status: "You've successfully deleted the event!" });
        });
    });

module.exports = eventsRouter;