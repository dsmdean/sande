var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');

var Companies = require('../models/companies');
var User = require('../models/users');
var Verify = require('./verify');

var companiesRouter = express.Router();
companiesRouter.use(bodyParser.json());

// GET/DELETE all companies - POST company
companiesRouter.route('/')
    .get(function(req, res, next) {
        Companies.find({})
            .populate('category')
            .exec(function(err, companies) {
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

// GET - PUT - DELETE company by id
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
            // delete company is users object
            res.json(resp);
        });
    });

// GET companies by name
companiesRouter.route('/searchByName/:companyName')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.find({ name: { $regex: "^" + req.params.companyName } })
            .populate('category')
            .populate('users.user')
            .exec(function(err, companies) {
                if (err) next(err);
                res.json(companies);
            });
    });

// GET specific company by name
companiesRouter.route('/byName/:companyName')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findOne({ name: req.params.companyName })
            .populate('category')
            .populate('users.user')
            .exec(function(err, company) {
                if (err) next(err);
                res.json(company);
            });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findOneAndUpdate({ name: req.params.companyName }, {
            $set: req.body
        }, {
            new: true
        }, function(err, company) {
            if (err) next(err);
            res.json(company);
        });
    });

// GET/DELETE all company products - POST company product
companiesRouter.route('/:companyId/products')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);
            res.json(company.products);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            req.body.images = [];
            req.body.images.push('default-company-image-300.jpg');
            company.products.push(req.body);
            company.save();
            res.json({ status: "Succesfully added company product!", product: company.products[company.products.length - 1] });
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            company.products = [];
            company.save();
            res.json({ status: "Succesfully deleted company products!", company: company });
        });
    });

// GET/PUT/DELETE specific company product
companiesRouter.route('/:companyId/products/:productId')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);
            res.json(company.products.id(req.params.productId));
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            // company.products.id(req.params.productId) = req.body;
            company.products.id(req.params.productId).remove();
            company.products.push(req.body);
            company.save();

            res.json({ status: "Product updated successfully!", products: company.products, product: req.body });
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            company.products.id(req.params.productId).remove();

            company.save(function(err, company) {
                if (err) next(err);

                res.json({ status: 'Product deleted!', products: company.products });
            });
        });
    });

// POST a company product image
companiesRouter.route('/:companyId/products/:productId/uploadNewPicture')
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        var storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './public/src/img/company-profile/products/')
            },
            filename: function(req, file, cb) {
                if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
                    var err = new Error();
                    err.code = 'filetype';
                    return cb(err);
                } else {
                    file.date = Date.now();
                    var extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
                    cb(null, file.date + '_' + req.params.companyId + '_' + req.params.productId + '.jpg');
                }
            }
        });

        var upload = multer({
            storage: storage,
            limits: { fileSize: 2000000 }
        }).single('picture');

        upload(req, res, function(err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    res.status(202).json({
                        success: false,
                        status: 'File size is too large. Max limit is 2MB'
                    });
                } else if (err.code === 'filetype') {
                    res.status(202).json({
                        success: false,
                        status: 'File type is invalid. Must be .jpeg/.jpg/.png'
                    });
                } else {
                    console.log(err);
                    res.status(202).json({
                        success: false,
                        status: 'File was not able to be uploaded'
                    });
                }
            } else {
                if (!req.file) {
                    console.log(req.file);
                    res.status(202).json({
                        success: false,
                        status: 'No file was selected'
                    });
                } else {
                    Companies.findById(req.params.companyId, function(err, company) {
                        if (err) next(err);

                        var imageName = req.file.date + '_' + req.params.companyId + '_' + req.params.productId + '.jpg';
                        // var product = company.products.id(req.params.productId);
                        company.products.id(req.params.productId).images.push(imageName);
                        company.save();

                        res.status(200).json({
                            success: true,
                            status: 'You\'ve successfully uploaded the picture',
                            product: company.products.id(req.params.productId),
                            products: company.products
                        });
                    });
                }
            }
        });
    });

// GET/DELETE all company services - POST company service
companiesRouter.route('/:companyId/services')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);
            res.json(company.services);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            company.services.push(req.body);
            company.save();
            res.json({ status: "Succesfully added company service!", service: req.body });
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            company.services = [];
            company.save();
            res.json({ status: "Succesfully deleted company services!", company: company });
        });
    });

// GET/PUT/DELETE specific company service
companiesRouter.route('/:companyId/services/:serviceId')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);
            res.json(company.services.id(req.params.serviceId));
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            // company.services.id(req.params.serviceId) = req.body;
            company.services.id(req.params.serviceId).remove();
            company.services.push(req.body);
            company.save();

            res.json({ status: "Service updated successfully!", services: company.services });
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Companies.findById(req.params.companyId, function(err, company) {
            if (err) next(err);

            company.services.id(req.params.serviceId).remove();

            company.save(function(err, company) {
                if (err) next(err);

                res.json({ status: 'Service deleted!', services: company.services });
            });
        });
    });

// upload a new profile picture
companiesRouter.route('/:companyId/uploadPicture')
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        var storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './public/src/img/company-profile/')
            },
            filename: function(req, file, cb) {
                if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
                    var err = new Error();
                    err.code = 'filetype';
                    return cb(err);
                } else {
                    file.date = Date.now();
                    var extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
                    cb(null, file.date + '_' + req.params.companyId + '.jpg');
                }
            }
        });

        var upload = multer({
            storage: storage,
            limits: { fileSize: 2000000 }
        }).single('picture');

        upload(req, res, function(err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    res.status(202).json({
                        success: false,
                        status: 'File size is too large. Max limit is 2MB'
                    });
                } else if (err.code === 'filetype') {
                    res.status(202).json({
                        success: false,
                        status: 'File type is invalid. Must be .jpeg/.jpg/.png'
                    });
                } else {
                    console.log(err);
                    res.status(202).json({
                        success: false,
                        status: 'File was not able to be uploaded'
                    });
                }
            } else {
                if (!req.file) {
                    console.log(req.file);
                    res.status(202).json({
                        success: false,
                        status: 'No file was selected'
                    });
                } else {
                    Companies.findById(req.params.companyId, function(err, company) {
                        if (err) next(err);

                        // console.log(company);

                        company.image = req.file.date + '_' + company._id + '.jpg';
                        company.save();

                        res.status(200).json({
                            success: true,
                            status: 'You\'ve successfully uploaded your profile picture',
                            company: company
                        });
                    });
                }
            }
        });
    });

module.exports = companiesRouter;