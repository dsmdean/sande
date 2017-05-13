var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var CompanyCategories = require('../models/companyCategories');
var Verify = require('./verify');

var companyCategoryRouter = express.Router();
companyCategoryRouter.use(bodyParser.json());

companyCategoryRouter.route('/')
    .get(function(req, res, next) {
        CompanyCategories.find({}, function(err, categories) {
            if (err) next(err);
            res.json(categories);
        });
    })
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        CompanyCategories.create(req.body, function(err, category) {
            if (err) next(err);

            console.log('Category created!');
            var id = category._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            res.end('Added the category with id: ' + id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        CompanyCategories.remove({}, function(err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

companyCategoryRouter.route('/:categoryId')
    .all(Verify.verifyOrdinaryUser)
    .get(function(req, res, next) {
        CompanyCategories.findById(req.params.categoryId, function(err, category) {
            if (err) next(err);
            res.json(category);
        });
    })
    .put(Verify.verifyAdmin, function(req, res, next) {
        CompanyCategories.findByIdAndUpdate(req.params.categoryId, {
            $set: req.body
        }, {
            new: true
        }, function(err, category) {
            if (err) next(err);
            res.json(category);
        });
    })
    .delete(Verify.verifyAdmin, function(req, res, next) {
        CompanyCategories.remove(req.params.categoryId, function(err, resp) {
            if (err) next(err);

            res.json(resp);
        });
    });

module.exports = companyCategoryRouter;