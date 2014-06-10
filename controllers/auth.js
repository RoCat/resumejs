'use strict';



module.exports = function (app) {
    app.get('/auth', function (req, res) {
        if(req.session.isAdmin){
            var scrappers = require('../lib/scrappers.js');
            var scrapper = scrappers.getScrapper(req.query.scrapper);
            console.log(scrapper);
            if(typeof scrapper === 'object' && typeof scrapper.auth === 'function'){
                scrapper.auth(req, res);
            } else {
                res.send(403, 'no scrapper specified or scrapper is not of type oauth');
            }
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

