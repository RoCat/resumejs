'use strict';


var AdminModel = require('../models/admin');


module.exports = function (app) {

    var model = new AdminModel();

    app.get('/admin', function (req, res) {
        if(req.session.isAdmin){
            var linkedin = require('../lib/linkedIn.js');
            var infos = linkedin.getStoredInfo();
            var fs = require('fs');
            model.lastActualisation = infos.lastActualisation;
            model.linkedInLogin = infos.emailAddress;
            model.page = "admin";
            model.templates = fs.readdirSync('public/templates/front');
            if(fs.existsSync('data/adminInfo.json')){
                model.adminData = JSON.parse(fs.readFileSync('data/adminInfo.json', 'utf8'));
            } else {
                model.adminData = {};
            }
            res.render('admin', model);
        } else {
            res.redirect('/login');
        }
    });

    app.post('/admin', function (req, res) {
        if(req.session.isAdmin){
            console.log(req.body);
            var jsonObj = {};
            jsonObj.template = req.body.template;
            jsonObj.title = req.body.title;
            jsonObj.subtitle = req.body.subtitle;
            jsonObj.summary = req.body.summary;
            jsonObj.facebook = req.body.facebook;
            jsonObj.twitter = req.body.twitter;
            jsonObj.github = req.body.github;
            jsonObj = JSON.stringify(jsonObj);
            var fs = require('fs');
            var path = require('path');
            console.log(fs.writeFileSync(path.resolve("data/adminInfo.json"), jsonObj));
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
    });

    app.get('/login', function (req, res) {
        res.render('login', model);
    });

    app.post('/login', function (req, res) {
        if(req.body.login && req.body.password){
            if(req.body.login === "admin" && req.body.password === "admin"){
                req.session.isAdmin = 1;
                res.redirect('/admin');
            } else {
                res.render('login', model);
            }
        } else {
            res.render('login', model);
        }
    });

    app.get('/getInfos', function (req, res) {
        if(req.session.isAdmin){
            if(req.query.initialUrl) {
                req.session.initialUrl = req.query.initialUrl;
            }
            if(req.session.token){
                var linkedin = require('../lib/linkedIn.js');
                linkedin.getInfos(req.session.token, function(err, infos){
                    var path = require('path');
                    var fs = require('fs');
                    var currentDate = new Date();
                    infos = JSON.parse(infos);
                    infos.lastActualisation = currentDate.getTime();
                    infos = JSON.stringify(infos);
                    fs.writeFile(path.resolve("data/linkedInInfo.json"), infos, function(err) {
                        if(err) {
                            res.send(err);
                        } else {
                            console.log(req.session);
                            if(req.session.initialUrl){
                                res.redirect(req.session.initialUrl);
                                req.session.initialUrl = undefined;
                            } else {
                                res.send(infos);
                            }
                        }
                    });
                });
            } else {
                res.redirect('/auth');
            }
        } else {
            res.redirect('/login');
        }
    });
};
