'use strict';
var logModel = require('../models/log');


module.exports = function (app) {

  var model = new logModel();


  app.get('/', function (req, res) {
    var scrappers = require('../lib/scrappers.js');
    model.scrappers = scrappers.getScrappersData();
    var adminLib = require('../lib/admin.js');
    model.adminData = adminLib.getStoredData(true);

    var themedController = req.themedController;
    if(!themedController){
      themedController = 'index';
    }
    model.page = themedController;
    var themeLib = require('../lib/theme.js');
    var themedView = themeLib.getThemedView(themedController, app.settings);
    res.render(themedView, model);
  });

  app.get('/getData', function (req, res) {
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

};
