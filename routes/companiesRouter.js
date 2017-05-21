var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Companies = require('../models/companies');
var User = require('../models/users');
var Verify = require('./verify');

var companiesRouter = express.Router();
companiesRouter.use(bodyParser.json());

companiesRouter.route('/')
    .get(function(req, res, next) {
        Companies.find({}, function(err, companies) {
            if (err) next(err);
            res.json(companies);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.create(req.body, function(err, company) {
            if (err) next(err);

            console.log('Company created!');
            var id = company._id;

            // save user to company
            company.users.push({ user: req.decoded._id });
            company.save();

            //save company to user
            User.findById(req.decoded._id)
                .populate('companies')
                .exec(function(err, user) {
                    if (err) next(err);

                    user.companies.push(company._id);
                    user.save();

                    user.companies[user.companies.length - 1] = company;

                    res.json({ success: true, status: 'Successfully created the company: ' + company.name, company: company, user: user });
                });
        });
    })
    .delete(function(req, res, next) {
        Companies.remove({}, function(err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

companiesRouter.route('/:companyId')
    .get(function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);
            res.json(company);
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findByIdAndUpdate(req.params.companyId, {
            $set: req.body
        }, {
            new: true
        }, function(err, company) {
            if (err) next(err);
            res.json(company);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.remove({ _id: req.params.companyId }, function(err, resp) {
            if (err) next(err);

            res.json(resp);
        });
    });

companiesRouter.route('/getByName/:companyName')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findOne({ name: req.params.companyName })
            .populate('category')
            .populate('users.user')
            .exec(function(err, company) {
                if (err) next(err);
                res.json(company);
            });
    });


module.exports = companiesRouter;