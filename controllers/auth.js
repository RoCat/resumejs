'use strict';



module.exports = function (app) {
    app.get('/auth', function (req, res) {
        if(req.session.isAdmin){
            var scrappers = require('../lib/scrappers.js');
            var scrapper = scrappers.getScrapper(req.query.scrapper);
            scrapper.auth(req, res);
        } else {
            res.redirect('/login');
        }
    });
    app.get('/authCallback', function (req, res) {
        if(req.session.isAdmin){
            var scrappers = require('../lib/scrappers.js');
            var scrapper = scrappers.getScrapper(req.query.scrapper);
            scrapper.authCallback(req, res);
        } else {
            res.redirect('/login');
        }
    });
};

