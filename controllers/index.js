'use strict';


var logModel = require('../models/log');


module.exports = function (app) {

    var model = new logModel();


    app.get('/', function (req, res) {
        var linkedin = require('../lib/linkedIn.js');
        var infos = linkedin.getStoredInfo();
        model.infos = infos;
        model.page = "home";
        var fs = require("fs");
        var path = require("path");
        if(fs.existsSync('data/adminInfo.json')){
            model.adminData = JSON.parse(fs.readFileSync('data/adminInfo.json', 'utf8').replace(/\\n/g, '<br \>'));
        } else {
            model.adminData = {};
        }
        var themeLib = require('../lib/theme.js');
        var themedView = themeLib.getThemedView('index', app.settings);
        res.render(themedView, model);
    });

    app.get('/resume', function (req, res) {
        var linkedin = require('../lib/linkedIn.js');
        var infos = linkedin.getStoredInfo();
        var fs = require("fs");
        var path = require("path");
        if(fs.existsSync('data/adminInfo.json')){
            model.adminData = JSON.parse(fs.readFileSync('data/adminInfo.json', 'utf8').replace(/\\n/g, '<br \>'));
        } else {
            model.adminData = {};
        }
        model.infos = infos;
        model.page = "resume";
        var themeLib = require('../lib/theme.js');
        var themedView = themeLib.getThemedView('resume', app.settings);
        res.render(themedView, model);
    });



};
