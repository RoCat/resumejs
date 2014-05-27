'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    app = {};


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
    server.customConfig = require('./config/customConfig.json');
    var scrappers = require('./lib/scrappers.js');
    server.customConfig.scrappers = scrappers.getScrappersConfig();
    server.use(express.methodOverride());
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
    //if route is not found redirect to index controller with current route as a view to display
    var errorFunc = function(){
        return function (req, res, next) {
            var i = 0;
            while (i < server.routes.get.length && server.routes.get[i].path !== "/"){
                i++;
            }
            req.themedController = req._parsedUrl.path.substr(1,req._parsedUrl.path.length);
            server.routes.get[i].callbacks[0](req, res, next);
        }
    };
    server.use(errorFunc());
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err.stack);
        }
        require('./lib/dustjs-helpers.js');
    });
}


module.exports = app;
