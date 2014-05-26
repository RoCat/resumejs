'use strict';


var logModel = require('../models/log');


module.exports = function (app) {

    var model = new logModel();


    app.get('/', function (req, res) {
        var scrappers = require('../lib/scrappers.js');
        model.scrappers = scrappers.getScrappersData();
        var adminLib = require('../lib/admin.js');
        model.adminData = adminLib.getStoredData();

        var themedController = req.themedController;
        if(!themedController){
            themedController = 'index';
        }
        model.page = themedController;
        var themeLib = require('../lib/theme.js');
        var themedView = themeLib.getThemedView(themedController, app.settings);
        res.render(themedView, model);
    });



};
