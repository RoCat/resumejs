'use strict';

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , Twit = require('twit');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var config = require('./twitter.json');


passport.use(new TwitterStrategy({
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    callbackURL: config.callbackUrl
  },
  function(token, tokenSecret, profile, done) {
    var data = {"token": token, "tokenSecret": tokenSecret, "profile": profile};
    done(null,data);
  }
));

var twitter = {
  isOauth: true,
  getData: function(session, callback){
    var https = require('https');
    var params = {
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token: session.passport.user.token,
      access_token_secret: session.passport.user.tokenSecret
    };
    var T = new Twit(params);
    T.get('statuses/home_timeline', {count: 10}, function (err, reply) {
      var twitterData = {};
      twitterData.home_timeline = reply;
      T.get('statuses/user_timeline', {count: 10}, function (err, reply) {
        twitterData.user_timeline = reply;
        callback(err,JSON.stringify(twitterData));
      });
    });

  },
  getStoredData: function(){
    var fs = require('fs');
    var path = require('path');
    var dataFilePath = path.resolve('data/twitterData.json');
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
    fs.writeFile(path.resolve('data/twitterData.json'), data, function(err) {
      callback(err, data);
    });
  },
  auth: function(req, res){
    passport.authenticate('twitter')(req,res, function(err,data){console.log(err,data);});
  },
  authCallback: function(req, res){
      var after = function(req,res){
        res.redirect('/admin');
      }
      passport.initialize()(req,res, function(){
        passport.session({ secret: 'keyboard resume' })(req,res, function(){
          passport.authenticate('twitter', { failureRedirect: '/login' })(req, res, function(err,data){
            if(req.session.passport && req.session.passport.user && req.session.passport.user.token && req.session.passport.user.tokenSecret){
              req.session.twitter_token = req.session.passport.user.token;
              req.session.twitter_tokenSecret = req.session.passport.user.tokenSecret;
              res.redirect('/getScrapperData?scrapper=twitter');
            } else {
              res.redirect('/admin');
            }
          });
        })
      });
  }
};
module.exports = twitter;