// grab the things we need
var express = require('express');
var userRouter = express.Router();
var passport = require('passport');
var querystring = require('querystring');
var nodemailer = require('nodemailer');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/src/img/user-profile/')
    },
    filename: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            file.date = Date.now();
            var extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
            cb(null, file.date + '_' + req.params.userId + '.jpg');
        }
    }
})

var upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }
}).single('picture');

// import models
var User = require('../models/users');
var Verify = require('./verify');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'infosandeinc@gmail.com',
        pass: '!*adminroot!*'
    }
});

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

                    // setup email data with unicode symbols
                    var mailOptions = {
                        from: '"SANDE INC" <info@sande-inc.com>', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'Welcome to SANDE INC', // Subject line
                        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <title>Welcome to SANDE INC</title> <style type="text/css"> #outlook a { padding: 0; } body { width: 100%!important; } .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; } body { -webkit-text-size-adjust: none; } body { margin: 0; padding: 0; } img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; } table td { border-collapse: collapse; } #backgroundTable { height: 100%!important; margin: 0; padding: 0; width: 100%!important; } body, #backgroundTable { background-color: #EEEEEE; } #templateContainer { border: 1px solid #BBBBBB; } h1, .h1 { color: #202020; display: block; font-family: Arial; font-size: 40px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } h2, .h2 { color: #404040; display: block; font-family: Arial; font-size: 18px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } h3, .h3 { color: #606060; display: block; font-family: Arial; font-size: 16px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } h4, .h4 { color: #808080; display: block; font-family: Arial; font-size: 14px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } #templatePreheader { background-color: #eeeeee; } .preheaderContent div { color: #707070; font-family: Arial; font-size: 10px; line-height: 100%; text-align: left; } .preheaderContent div a:link, .preheaderContent div a:visited, .preheaderContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } #social div { text-align: right; } #templateHeader { background-color: #FFFFFF; border-bottom: 5px solid #505050; } .headerContent { color: #202020; font-family: Arial; font-size: 34px; font-weight: bold; line-height: 100%; padding: 10px; text-align: right; vertical-align: middle; } .headerContent a:link, .headerContent a:visited, .headerContent a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } #headerImage { height: auto; max-width: 600px!important; } #templateContainer, .bodyContent { background-color: #FDFDFD; } .bodyContent div { color: #505050; font-family: Arial; font-size: 14px; line-height: 150%; text-align: justify; } .bodyContent div a:link, .bodyContent div a:visited, .bodyContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } .bodyContent img { display: inline; height: auto; } #templateSidebar { background-color: #FDFDFD; } .sidebarContent { border-left: 1px solid #DDDDDD; } .sidebarContent div { color: #505050; font-family: Arial; font-size: 10px; line-height: 150%; text-align: left; } .sidebarContent div a:link, .sidebarContent div a:visited, .sidebarContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } .sidebarContent img { display: inline; height: auto; } #templateFooter { background-color: #FAFAFA; border-top: 3px solid #909090; } .footerContent div { color: #707070; font-family: Arial; font-size: 11px; line-height: 125%; text-align: left; } .footerContent div a:link, .footerContent div a:visited, .footerContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } .footerContent img { display: inline; } #social { background-color: #FFFFFF; border: 0; } #social div { text-align: left; } #utility { background-color: #FAFAFA; border-top: 0; } #utility div { text-align: left; } #monkeyRewards img { max-width: 170px!important; } </style> </head> <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"> <center> <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="10" cellspacing="0" width="600" id="templatePreheader"> <tr> <td valign="top" class="preheaderContent"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td valign="top"> <div mc:edit="std_preheader_content"> Registration succesfully submitted. Text here will show in the preview area of some email clients. </div> </td> <td valign="top" width="170"> <div mc:edit="std_preheader_links"> Email not displaying correctly?<br/><a href="*|ARCHIVE|*" target="_blank">View it in your browser</a>. </div> </td> </tr> </table> </td> </tr> </table> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateHeader"> <tr> <td class="headerContent" width="100%" style="padding-left:20px; padding-right:10px;"> <div mc:edit="Header_content"> <h1>Welcome !</h1> </div> </td> <td class="headerContent"> <img src="https://sande-test.herokuapp.com/src/img/samples/email-sample-small-180-3.png" style="max-width:180px;" id="headerImage campaign-icon" mc:label="header_image" mc:edit="header_image" mc:allowtext /> </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top"> <table border="0" cellpadding="10" cellspacing="0" width="600" id="templateBody"> <tr> <td valign="top" class="bodyContent"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td valign="top" style="padding-right:0;"> <div mc:edit="std_content00"> <h4 class="h3">Confirm your email</h4> Click on the following link to activate your account: <a href="https://sande-test.herokuapp.com/src/#/activate/' + user._id + '">https://sande-test.herokuapp.com/src/#/activate/' + user._id + '</a>. Customize your template by clicking on the style editor tabs up above. Set your fonts, colors, and styles. After setting your styling is all done you can click here in this area, delete the text, and start adding your own awesome content! <br/> <br/> <h4 class="h4">Heading 4</h4> After you enter your content, highlight the text you want to style and select the options you set in the style editor in the "styles" drop down box. Want to <a href="http://www.mailchimp.com/kb/article/im-using-the-style-designer-and-i-cant-get-my-formatting-to-change" target="_blank">get rid of styling on a bit of text</a>, but having trouble doing it? Just use the "remove formatting" button to strip the text of any formatting and reset your style. </div> </td> </tr> </table> </td> <td valign="top" width="180" id="templateSidebar"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top"> <table border="0" cellpadding="20" cellspacing="0" width="100%" class="sidebarContent"> <tr> <td valign="top" style="padding-right:10px;"> <div mc:edit="std_content01"> <strong>Basic content module</strong> <br/> Far far away, behind the word mountains. <br/> <br/> <strong>Far from the countries</strong> <br/> Vokalia and Consonantia, there live the blind texts. </div> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateFooter"> <tr> <td valign="top" class="footerContent"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td colspan="2" valign="middle" id="social"> <div mc:edit="std_social"> &nbsp;<a href="*|TWITTER:PROFILEURL|*">follow on Twitter</a> | <a href="*|FACEBOOK:PROFILEURL|*">friend on Facebook</a> | <a href="*|FORWARD|*">forward to a friend</a>&nbsp; </div> </td> </tr> <tr> <td valign="top" width="350"> <div mc:edit="std_footer"> <em>Copyright &copy; *|CURRENT_YEAR|* *|LIST:COMPANY|*, All rights reserved.</em> <br/> *|IFNOT:ARCHIVE_PAGE|* *|LIST:DESCRIPTION|* <br/> <strong>Our mailing address is:</strong> <br/> *|HTML:LIST_ADDRESS_HTML|**|END:IF|* </div> </td> <td valign="top" width="190" id="monkeyRewards"> <div mc:edit="monkeyrewards"> *|IF:REWARDS|* *|HTML:REWARDS|* *|END:IF|* </div> </td> </tr> <tr> <td colspan="2" valign="middle" id="utility"> <div mc:edit="std_utility"> &nbsp;<a href="*|UNSUB|*">unsubscribe from this list</a> | <a href="*|UPDATE_PROFILE|*">update subscription preferences</a>&nbsp; </div> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <br/> </td> </tr> </table> </center> </body> </html>' // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });

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

            User.findById(user._id)
                .populate('companies')
                .exec(function(err, populatedUser) {
                    if (err) next(err);

                    // console.log(populatedUser);

                    res.status(200).json({
                        status: 'Login Successful!',
                        succes: true,
                        token: token,
                        user: populatedUser
                    });
                });

            // res.status(200).json({
            //     status: 'Login Successful!',
            //     succes: true,
            //     token: token,
            //     user: user
            // });
        });
    })(req, res, next);
});

// logout user
userRouter.get('/logout', Verify.verifyOrdinaryUser, function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Logout Successful!'
    });
});

// log in using facebook
userRouter.get('/facebook', passport.authenticate('facebook'),
    function(req, res) {});

// facebook callback
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

            user.activated = true;
            user.save();

            res.redirect('https://sande-test.herokuapp.com/src/#/login/callback?token=' + token + '&user=' + user._id);
            // res.redirect('http://localhost:3000/src/#/login/callback?token=' + token + '&user=' + user._id);
        });
    })(req, res, next);
});

// send forgot password email
userRouter.route('/recoverPassword')
    // recover a specific user's password
    .post(function(req, res, next) {
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) next(err);

            // setup email data with unicode symbols
            var mailOptions = {
                from: '"SANDE INC" <info@sande-inc.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'SANDE INC - Forgot Password?', // Subject line
                html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <title>SANDE INC - Forgot Password?</title> <style type="text/css"> #outlook a { padding: 0; } body { width: 100%!important; } .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; } body { -webkit-text-size-adjust: none; } body { margin: 0; padding: 0; } img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; } table td { border-collapse: collapse; } #backgroundTable { height: 100%!important; margin: 0; padding: 0; width: 100%!important; } body, #backgroundTable { background-color: #EEEEEE; } #templateContainer { border: 1px solid #BBBBBB; } h1, .h1 { color: #202020; display: block; font-family: Arial; font-size: 40px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } h2, .h2 { color: #404040; display: block; font-family: Arial; font-size: 18px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } h3, .h3 { color: #606060; display: block; font-family: Arial; font-size: 16px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } h4, .h4 { color: #808080; display: block; font-family: Arial; font-size: 14px; font-weight: bold; line-height: 100%; margin-top: 2%; margin-right: 0; margin-bottom: 1%; margin-left: 0; text-align: left; } #templatePreheader { background-color: #eeeeee; } .preheaderContent div { color: #707070; font-family: Arial; font-size: 10px; line-height: 100%; text-align: left; } .preheaderContent div a:link, .preheaderContent div a:visited, .preheaderContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } #social div { text-align: right; } #templateHeader { background-color: #FFFFFF; border-bottom: 5px solid #505050; } .headerContent { color: #202020; font-family: Arial; font-size: 34px; font-weight: bold; line-height: 100%; padding: 10px; text-align: right; vertical-align: middle; } .headerContent a:link, .headerContent a:visited, .headerContent a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } #headerImage { height: auto; max-width: 600px!important; } #templateContainer, .bodyContent { background-color: #FDFDFD; } .bodyContent div { color: #505050; font-family: Arial; font-size: 14px; line-height: 150%; text-align: justify; } .bodyContent div a:link, .bodyContent div a:visited, .bodyContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } .bodyContent img { display: inline; height: auto; } #templateSidebar { background-color: #FDFDFD; } .sidebarContent { border-left: 1px solid #DDDDDD; } .sidebarContent div { color: #505050; font-family: Arial; font-size: 10px; line-height: 150%; text-align: left; } .sidebarContent div a:link, .sidebarContent div a:visited, .sidebarContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } .sidebarContent img { display: inline; height: auto; } #templateFooter { background-color: #FAFAFA; border-top: 3px solid #909090; } .footerContent div { color: #707070; font-family: Arial; font-size: 11px; line-height: 125%; text-align: left; } .footerContent div a:link, .footerContent div a:visited, .footerContent div a .yshortcuts { color: #58DDD0; font-weight: normal; text-decoration: underline; } .footerContent img { display: inline; } #social { background-color: #FFFFFF; border: 0; } #social div { text-align: left; } #utility { background-color: #FAFAFA; border-top: 0; } #utility div { text-align: left; } #monkeyRewards img { max-width: 170px!important; } </style> </head> <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"> <center> <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="10" cellspacing="0" width="600" id="templatePreheader"> <tr> <td valign="top" class="preheaderContent"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td valign="top"> <div mc:edit="std_preheader_content"> Registration succesfully submitted. Text here will show in the preview area of some email clients. </div> </td> <td valign="top" width="170"> <div mc:edit="std_preheader_links"> Email not displaying correctly?<br/><a href="*|ARCHIVE|*" target="_blank">View it in your browser</a>. </div> </td> </tr> </table> </td> </tr> </table> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateHeader"> <tr> <td class="headerContent" width="100%" style="padding-left:20px; padding-right:10px;"> <div mc:edit="Header_content"> <h2>Recover account</h2> </div> </td> <td class="headerContent"> <img src="https://sande-test.herokuapp.com/src/img/samples/email-sample-small-180-3.png" style="max-width:180px;" id="headerImage campaign-icon" mc:label="header_image" mc:edit="header_image" mc:allowtext /> </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top"> <table border="0" cellpadding="10" cellspacing="0" width="600" id="templateBody"> <tr> <td valign="top" class="bodyContent"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td valign="top" style="padding-right:0;"> <div mc:edit="std_content00"> <h4 class="h3">Recover your password</h4> Click on the following link to set a new password: <a href="https://sande-test.herokuapp.com/src/#/recover/' + user._id + '">https://sande-test.herokuapp.com/src/#/recover/' + user._id + '</a>. Customize your template by clicking on the style editor tabs up above. Set your fonts, colors, and styles. After setting your styling is all done you can click here in this area, delete the text, and start adding your own awesome content! <br/> <br/> <h4 class="h4">Heading 4</h4> After you enter your content, highlight the text you want to style and select the options you set in the style editor in the "styles" drop down box. Want to <a href="http://www.mailchimp.com/kb/article/im-using-the-style-designer-and-i-cant-get-my-formatting-to-change" target="_blank">get rid of styling on a bit of text</a>, but having trouble doing it? Just use the "remove formatting" button to strip the text of any formatting and reset your style. </div> </td> </tr> </table> </td> <td valign="top" width="180" id="templateSidebar"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top"> <table border="0" cellpadding="20" cellspacing="0" width="100%" class="sidebarContent"> <tr> <td valign="top" style="padding-right:10px;"> <div mc:edit="std_content01"> <strong>Basic content module</strong> <br/> Far far away, behind the word mountains. <br/> <br/> <strong>Far from the countries</strong> <br/> Vokalia and Consonantia, there live the blind texts. </div> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateFooter"> <tr> <td valign="top" class="footerContent"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td colspan="2" valign="middle" id="social"> <div mc:edit="std_social"> &nbsp;<a href="*|TWITTER:PROFILEURL|*">follow on Twitter</a> | <a href="*|FACEBOOK:PROFILEURL|*">friend on Facebook</a> | <a href="*|FORWARD|*">forward to a friend</a>&nbsp; </div> </td> </tr> <tr> <td valign="top" width="350"> <div mc:edit="std_footer"> <em>Copyright &copy; *|CURRENT_YEAR|* *|LIST:COMPANY|*, All rights reserved.</em> <br/> *|IFNOT:ARCHIVE_PAGE|* *|LIST:DESCRIPTION|* <br/> <strong>Our mailing address is:</strong> <br/> *|HTML:LIST_ADDRESS_HTML|**|END:IF|* </div> </td> <td valign="top" width="190" id="monkeyRewards"> <div mc:edit="monkeyrewards"> *|IF:REWARDS|* *|HTML:REWARDS|* *|END:IF|* </div> </td> </tr> <tr> <td colspan="2" valign="middle" id="utility"> <div mc:edit="std_utility"> &nbsp;<a href="*|UNSUB|*">unsubscribe from this list</a> | <a href="*|UPDATE_PROFILE|*">update subscription preferences</a>&nbsp; </div> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <br/> </td> </tr> </table> </center> </body> </html>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });

            res.json({ message: 'You\'ve succesfully send a recovery email!', user: user });
        });
    });

// specific user
userRouter.route('/:userId')
    // get a specific user
    .get(function(req, res, next) {
        User.findById(req.params.userId)
            .populate('companies')
            .exec(function(err, user) {
                if (err) next(err);
                res.json(user);
            });
    })
    // update a specific user
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findByIdAndUpdate(req.params.userId, {
            $set: req.body
        }, {
            new: true
        }, function(err, user) {
            if (err) next(err);
            res.json({ status: "You've succesfully updated your profile.", user: user });
        });
    })
    // delete a specific user
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            user.remove({});
            res.json({ status: "Succesfully deleted " + user.firstname + " " + user.lastname });
        });
    });

// activate a specific user
userRouter.route('/:userId/activate')
    .put(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            user.activated = true;
            user.save();
            res.json({ message: 'You\'ve succesfully activated your account!', user: user });
        });
    });

// set a new user's password
userRouter.route('/:userId/setNewPassword')
    .post(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            user.setPassword(req.body.newPassword, function() {
                user.save();
                res.status(200).json({ status: 'You\'ve successfully set a new password!' });
            });
        });
    });

// update a specific user password
userRouter.route('/:userId/setPassword')
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        // check if user & password correct
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: 'Your old password is not correct.'
                });
            }

            // set new password
            user.setPassword(req.body.newPassword, function() {
                user.save();
                res.status(200).json({ status: 'You\'ve successfully set a new password!' });
            });
        })(req, res, next);
    });

// upload a new profile picture
userRouter.route('/:userId/uploadPicture')
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
                    User.findById(req.params.userId)
                        .populate('companies')
                        .exec(function(err, user) {
                            if (err) next(err);

                            // console.log(req.file);

                            user.image = req.file.date + '_' + user._id + '.jpg';
                            user.save();

                            res.status(200).json({
                                success: true,
                                status: 'You\'ve successfully uploaded your profile picture',
                                user: user
                            });
                        });
                }
            }
        });
    });

// specific user's invoices
userRouter.route('/:userId/invoices')
    // get a specific user
    .get(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);
            res.json(user.invoices);
        });
    })
    // delete a specific user
    .delete(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            user.invoices = [];
            user.save();
            res.json({ status: "Succesfully deleted user's invoices" });
        });
    });

// export router
module.exports = userRouter;