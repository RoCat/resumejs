'use strict';
var logModel = require('../models/log');
var path = require('path');
var fs = require('fs');

module.exports = function (app) {

  var model = new logModel();


  app.get('/', function (req, res) {
    var themeLib = require('../lib/theme.js');
    var scrappers = require('../lib/scrappers.js');
    model.scrappers = scrappers.getScrappersData();
    var adminLib = require('../lib/admin.js');
    model.adminData = adminLib.getStoredData(true);

    var themedController = req.themedController;
    if(!themedController){
      themedController = 'index';
    }


    //fix problem when we have query params
    var splitedController = themedController.split('?');
    themedController = splitedController[0];

    model.page = themedController;
    model.queryData = req.query;
    model.postData = req.post;

    var theme = model.adminData.theme;
    //get custom controller if any
    if(app.customControllers
      && app.customControllers[theme]
      && app.customControllers[theme][themedController]
      //controller found, now check if there is something for this method
      && app.customControllers[theme][themedController][req.method.toLowerCase()]
    ){
        //method is found, run it instead of next one
      req.model = model;
      req.themedController = themedController;
      app.customControllers[theme][themedController][req.method.toLowerCase()](req,res);
    } else {
      var themedView = themeLib.getThemedView(themedController, app.settings);
      themeLib.getThemeData(model.adminData.theme, true, function(err,themeData){
        model.themeData = themeData;
        res.render(themedView, model);
      });
    }
  });

  app.get('/scrapperData', function (req, res) {
    var scrapper = req.query.scrapper;
    var scrappers = require('../lib/scrappers.js');
    var scrapperData = scrappers.getScrapper(scrapper);
    if(!scrapperData){
      scrapperData = {'error':'This scrapper does not exist or have no data.'};
    } else {
      scrapperData = scrapperData.getStoredData();
      if(!scrapperData){
        scrapperData = {'error':'This scrapper does not exist or have no data.'};
      }
    }
    res.send(scrapperData);
  });

  app.get('/themeData', function (req, res) {
    var themeLib = require('../lib/theme.js');
    var adminLib = require('../lib/admin.js');
    var theme = req.query.theme;
    if(!theme){
      theme = adminLib.getStoredData(true).theme;
    }
    themeLib.getThemeData(theme, true, function(err,themeData){
      if(err){
        themeData = {'error':'This theme does not exist or have no data.'};
      }
      res.send(themeData);
    });
  });

};
