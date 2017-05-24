var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
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
})

var upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }
}).single('picture');

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

// upload a new profile picture
companiesRouter.route('/:companyId/uploadPicture')
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
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