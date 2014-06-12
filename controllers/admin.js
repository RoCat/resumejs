'use strict';


var AdminModel = require('../models/admin');


module.exports = function (app) {

  var model = new AdminModel();

  app.get('/admin', function (req, res) {
    if(req.session.isAdmin){
      var scrappers = require('../lib/scrappers.js');
      model.scrappersNames = scrappers.getScrappers();
      model.scrappers = scrappers.getScrappersData();
      var adminLib = require('../lib/admin.js');
      var fs = require('fs');
      model.page = 'admin';
      model.templates = fs.readdirSync('public/themes/templates');
      model.adminData = adminLib.getStoredData();
      res.render('admin', model);
    } else {
      res.redirect('/login');
    }
  });

  app.post('/admin', function (req, res) {
    if(req.session.isAdmin){
      var jsonObj = {};
      jsonObj.template = req.body.template;
      jsonObj.title = req.body.title;
      jsonObj.subtitle = req.body.subtitle;
      jsonObj.summary = req.body.summary;
      jsonObj.facebook = req.body.facebook;
      jsonObj.twitter = req.body.twitter;
      jsonObj.github = req.body.github;
      jsonObj = JSON.stringify(jsonObj);
      var admin = require('../lib/admin.js');
      admin.storeData(jsonObj, function(){
        res.redirect('/admin');
      });
    } else {
      res.redirect('/login');
    }
  });

  app.get('/login', function (req, res) {
    var scrappers = require('../lib/scrappers.js');
    model.scrappers = scrappers.getScrappersData();
    model.page = 'admin';
    var themeLib = require('../lib/theme.js');
    var themedView = themeLib.getThemedView('login', app.settings);
    res.render(themedView, model);
  });

  app.post('/login', function (req, res) {
    var scrappers = require('../lib/scrappers.js');
    model.scrappers = scrappers.getScrappersData();
    model.page = 'admin';
    var themeLib = require('../lib/theme.js');
    var themedView = themeLib.getThemedView('login', app.settings);
    if(req.body.login && req.body.password){
      if(req.body.login === app.customConfig.admin.login && req.body.password === app.customConfig.admin.password){
        req.session.isAdmin = 1;
        res.redirect('/admin');
      } else {
        res.render(themedView, model);
      }
    } else {
      res.render(themedView, model);
    }
  });
  app.get('/getScrapperData', function(req, res){
    var pScrapper = req.query.scrapper;
    var scrappers = require('../lib/scrappers.js');
    if(req.session.isAdmin){
      if(req.query.initialUrl) {
        req.session.initialUrl = req.query.initialUrl;
      }
      var scrapper = scrappers.getScrapper(pScrapper);
      if(scrapper.isOauth){
        if(req.session[pScrapper+'_token']){
          scrapper.getData(req.session.linkedIn_token, function(err, scrapperData){
            scrapper.storeData(scrapperData, function (err) {
              if(err) {
                res.send(err);
              } else {
                console.log(req.session);
                if(req.session.initialUrl){
                  res.redirect(req.session.initialUrl);
                  req.session.initialUrl = undefined;
                } else {
                  res.send(scrapperData);
                }
              }
            });
          });
        } else {
          res.redirect('/auth?scrapper='+pScrapper);
        }
      } else {
        scrapper.getData(app.customConfig.scrappers[pScrapper].login, function(err, scrapperData){
          scrapper.storeData(scrapperData, function (err) {
            if(err) {
              res.send(err);
            } else {
              console.log(req.session);
              if(req.session.initialUrl){
                res.redirect(req.session.initialUrl);
                req.session.initialUrl = undefined;
              } else {
                res.send(scrapperData);
              }
            }
          });
        });
      }
    } else {
      res.redirect('/login');
    }
  });
};
