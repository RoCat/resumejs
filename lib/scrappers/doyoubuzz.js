'use strict';
var crypto = require('crypto');
var passport = require("passport");
var OAuth1Strategy = require('passport-oauth1');
var config = require('./doyoubuzz.json');
var oauthResult;
passport.use(new OAuth1Strategy({
    requestTokenURL: 'https://www.doyoubuzz.com/fr/oauth/requestToken',
    accessTokenURL: 'https://www.doyoubuzz.com/fr/oauth/accessToken',
    userAuthorizationURL: 'https://www.doyoubuzz.com/fr/oauth/authorize',
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    callbackURL: config.callbackUrl
  },
  function(token, tokenSecret, profile, done) {
    oauthResult = {token: token, tokenSecret:  tokenSecret, profile: profile};
    done(null, {token: token, tokenSecret:  tokenSecret, profile: profile});
  }
));
var doyoubuzz = {
  isOauth: true,
  getData: function(session, callback){
    var token = session.doyoubuzz_token;
    var tokenSecret = session.doyoubuzz_tokenSecret;
    passport._strategies.oauth._oauth.get('http://api.doyoubuzz.com/user?format=json',token,tokenSecret, function(err, data){
      if(!err){
        var user = JSON.parse(data);
        user = user.user;
        var resumesKeys = Object.keys(user.resumes);
        for (var cvKey in resumesKeys){
          var innerCvs = user.resumes[resumesKeys[cvKey]];
          for (var innerCvKey in innerCvs) {
            var cv = innerCvs[innerCvKey];
            if(cv.main === true){
              passport._strategies.oauth._oauth.get('http://api.doyoubuzz.com/cv/' + cv.id + '?format=json', token, tokenSecret, function (err, full_cv) {
                full_cv = JSON.parse(full_cv);
                user.resume = full_cv;
                delete user.resumes;
                callback(null,JSON.stringify(user));
              });
            } else {
              console.log("not a main CV");
            }
          }
        }
      } else {
        callback(err);
      }
    });
  },
  getStoredData: function(){
    var fs = require('fs');
    var path = require('path');
    var dataFilePath = path.resolve('data/doyoubuzzData.json');
    if(fs.existsSync(dataFilePath)){
      var options = {
        encoding: 'utf8'
      };
      var str = fs.readFileSync(dataFilePath, options);
      try {
        str = str.replace(/\\n/g, '<br />');
        str =  JSON.parse(str);
        return str;
      } catch(exception) {
        return exception;
      }
    } else {
      return false;
    }
  },
  storeData: function(data, callback){
    var path = require('path');
    var fs = require('fs');
    var currentDate = new Date();
    data = JSON.parse(data);
    data.lastActualisation = currentDate.getTime();
    data = JSON.stringify(data);
    fs.writeFile(path.resolve('data/doyoubuzzData.json'), data, function(err) {
      callback(err, data);
    });
  },
  auth: function(req, res){
    var config = require('./doyoubuzz.json');
    passport.authenticate('oauth')(req,res,function(err,rez){console.log(err,rez)});
  },
  authCallback: function(req, res){
    passport.authenticate('oauth', { failureRedirect: '/login' })(req,res, function(err, data) {

      req.session.doyoubuzz_token = oauthResult.token;
      req.session.doyoubuzz_tokenSecret = oauthResult.tokenSecret;
      res.redirect('/getScrapperData?scrapper=doyoubuzz');
    });
  }
};
module.exports = doyoubuzz;