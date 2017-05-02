// grab the things we need
var express = require('express');
var userRouter = express.Router();
var passport = require('passport');

// import models
var User = require('../models/users');
var Verify = require('./verify');

// get all users
userRouter.get('/', function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) next(err);
        res.json(users);
    });
});

// register user
userRouter.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username, email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname }),
        req.body.password,
        function(err, user) {
            if (err) {
                return res.status(500).json({ err: err });
            }

            if (req.body.admin) {
                user.admin = req.body.admin;
            }

            user.save(function(err, user) {
                passport.authenticate('local')(req, res, function() {
                    return res.status(200).json({ status: 'Registration Successful!' });
                });
            });
        });
});

// log user in
userRouter.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                err: info
            });
        }

        if (user.suspended) {
            return res.status(500).json({
                err: 'User suspended! Could not log in user'
            });
        }

        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken({ "username": user.username, "_id": user._id, "admin": user.admin });

            res.status(200).json({
                status: 'Login Successful!',
                succes: true,
                token: token,
                user: user
            });
        });
    })(req, res, next);
});

userRouter.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Logout Successful!'
    });
});

userRouter.route('/:userId')
    // get a specific user
    .get(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);
            res.json(user);
        });
    })
    // update a specific user
    .put(function(req, res, next) {
        User.findByIdAndUpdate(req.params.userId, {
            $set: req.body
        }, {
            new: true
        }, function(err, user) {
            if (err) next(err);
            res.json(user);
        });
    })
    // delete a specific user
    .delete(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            user.remove({});
            res.json(user);
        });
    });

userRouter.route('/:userId/setPassword')
    // update a specific user password
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        // check if user & password correct
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: 'Unauthorized: Password is not correct!'
                });
            }

            // set new password
            user.setPassword(req.body.newPassword, function() {
                user.save();
                res.status(200).json({ status: 'Password reset successful!' });
            });
        })(req, res, next);
    });

userRouter.get('/facebook', passport.authenticate('facebook'),
    function(req, res) {});

userRouter.get('/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken(user);

            res.status(200).json({
                status: 'Login succesful!',
                succes: true,
                token: token
            });
        });
    })(req, res, next);
});

// export router
module.exports = userRouter;