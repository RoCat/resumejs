'use strict';
var linkedin = {
  isOauth: true,
  getData: function(token, callback){
    var https = require('https');
    var fields = 'skills,' +
      'proposal-comments,' +
      'associations,' +
      'interests,' +
      'publications,' +
      'patents,' +
      'languages:(id,language,proficiency),' +
      'certifications,' +
      'educations,' +
      'courses,' +
      'volunteer,' +
      'three-current-positions,' +
      'three-past-positions,' +
      'num-recommenders,' +
      'recommendations-received,' +
      'mfeed-rss-url,' +
      'following,' +
      'job-bookmarks,' +
      'suggestions,' +
      'date-of-birth,' +
      'member-url-resources,' +
      'honors-awards,' +
      'email-address,' +
      'first-name,' +
      'last-name,' +
      'maiden-name,' +
      'formatted-name,' +
      'phonetic-first-name,' +
      'phonetic-last-name,' +
      'formatted-phonetic-name,' +
      'headline,' +
      'location:(name),' +
      'industry,' +
      'distance,' +
      'current-share,' +
      'num-connections,' +
      'summary,' +
      'specialties,' +
      'positions,' +
      'picture-url,' +
      'public-profile-url,' +
      'main-address,' +
      'phone-numbers';

    var options = {
      host: 'api.linkedin.com',
      port: '443',
      path: '/v1/people/~:('+fields+')?format=json&oauth2_access_token='+token,
      method: 'GET'
    };
    var rez = '';
    var request = https.request(options, function(res2){
      res2.setEncoding('utf8');

      res2.on('data', function (chunk) {
        rez += chunk;
      });
      res2.on('end', function () {
        callback(null,rez);
      });
      res2.on('error', function (err) {
        callback(err);
      });
    });
    request.on('error', function (err) {
      callback(err);
    });
    request.end();
  },
  getStoredData: function(){
    var fs = require('fs');
    var path = require('path');
    var dataFilePath = path.resolve('data/linkedInData.json');
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
    fs.writeFile(path.resolve('data/linkedInData.json'), data, function(err) {
      callback(err, data);
    });
  },
  auth: function(req, res){
    var config = require('./linkedIn.json');
    res.redirect('https://www.linkedin.com/uas/oauth2/authorization?response_type=code'+
      '&client_id='+config.consumerKey+
      '&state=activated'+
      '&scope=r_contactinfo+r_fullprofile+r_emailaddress'+
      '&redirect_uri='+(config.callbackUrl));
  },
  authCallback: function(req, res){
    var config = require('./linkedIn.json');
    var https = require('https');
    var querystring = require('querystring');
    var post_data = querystring.stringify({
    });
    var options = {
      host: 'www.linkedin.com',
      port: '443',
      path: '/uas/oauth2/accessToken?grant_type=authorization_code'+
        '&client_id='+config.consumerKey+
        '&client_secret='+config.consumerSecret+
        '&state='+'activated'+
        '&code='+req.query.code+
        '&redirect_uri='+config.callbackUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
    };

    var request = https.request(options, function(res2){
      res2.setEncoding('utf8');
      var rez = '';
      res2.on('data', function (chunk) {
        rez += chunk;
      });
      res2.on('end', function(){
        rez = JSON.parse(rez);
        if(rez && rez.access_token){
          req.session.linkedIn_token = rez.access_token;
          res.redirect('/getScrapperData?scrapper=linkedIn');
        } else {
          res.send(rez);
        }
      });
      res2.on('error',function(err){console.log(err);});
    });
    request.write(post_data);
    request.end();
    request.on('error', function(err){
      res.send(err);
    });
  }
};
module.exports = linkedin;