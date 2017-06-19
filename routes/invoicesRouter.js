var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Invoice = require('../models/invoices');
var User = require('../models/users');
var Companies = require('../models/companies');
var Verify = require('./verify');

var invoicesRouter = express.Router();
invoicesRouter.use(bodyParser.json());

// GET/DELETE all invoices - POST invoice
invoicesRouter.route('/')
    .get(function(req, res, next) {
        Invoice.find({}, function(err, invoices) {
            if (err) next(err);
            res.json(invoices);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        var total = 0;
        var invoices = [];
        var loop = 0;

        for (var companyId in req.body) {
            var invoice = {};
            invoice.date = Date.now();
            invoice.company = companyId;
            invoice.user = req.decoded._id;
            invoice.products = [];
            invoice.subTotal = 0;

            for (var i = 0; i < req.body[companyId].length; i++) {
                invoice.products.push({ qty: req.body[companyId][i].qty, product: req.body[companyId][i]._id, options: req.body[companyId][i].opt });
                total += req.body[companyId][i].qty * req.body[companyId][i].price;
                invoice.subTotal += req.body[companyId][i].qty * req.body[companyId][i].price;
            }

            Invoice.create(invoice, function(err, resp) {
                if (err) next(err);
                // console.log(resp);
                invoices.push(resp._id);
                loop++;
                // add invoice to company

                Companies.findById(companyId, function(err, company) {
                    if (err) next(err);

                    company.notification = true;
                    // company.notifications.amount++;
                    // company.notifications.notifications.push({ title: 'New order', route: '#/company/invoices/' + resp._id });
                    company.save();

                    if (Object.keys(req.body).length === loop) {
                        // User.findById(req.decoded._id, function(err, user) {
                        //     if (err) next(err);
                        //     user.invoices.push({ total: total, invoices: invoices });
                        //     console.log(user);
                        //     user.save();
                        //     res.json({ status: 'Successfully created a invoice' });
                        // });
                        res.json({ status: 'Successfully created a invoice' });
                    }
                });
            });
        }
    })
    .delete(function(req, res, next) {
        Invoice.remove({}, function(err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

// GET - PUT - DELETE invoice by id
invoicesRouter.route('/:invoiceId')
    .get(function(req, res, next) {
        Invoice.findById(req.params.invoiceId)
            .populate('company')
            .populate('user')
            .exec(function(err, invoice) {
                if (err) next(err);

                // var products = [];

                // for (var i = 0; i < invoice.products.length; i++) {
                //     // console.log(invoice.products[i]);
                //     // console.log(invoice.company.products);
                //     products.push(JSON.stringify(invoice.company.products.id(invoice.products[i])));
                // }

                // invoice.products = products;
                // console.log(invoice);
                res.json(invoice);
            });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Invoice.findByIdAndUpdate(req.params.invoiceId, {
            $set: req.body
        }, {
            new: true
        }, function(err, invoice) {
            if (err) next(err);
            res.json({ status: "You've successfully edited the invoice!", invoice: invoice });
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Invoice.remove({ _id: req.params.invoiceId }, function(err, resp) {
            if (err) next(err);
            // delete users invoice
            res.json({ status: "You've successfully deleted the invoice!" });
        });
    });

// GET user invoices
invoicesRouter.route('/user/:userId')
    .get(function(req, res, next) {
        Invoice.find({ user: req.params.userId })
            .populate('company')
            .exec(function(err, invoices) {
                if (err) next(err);
                res.json(invoices);
            });
    });

// GET company invoices
invoicesRouter.route('/company/:companyId')
    .get(function(req, res, next) {
        Invoice.find({ company: req.params.companyId })
            .populate('user')
            .exec(function(err, invoices) {
                if (err) next(err);
                res.json(invoices);
            });
    });

module.exports = invoicesRouter;