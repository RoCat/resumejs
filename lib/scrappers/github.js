'use strict';
var github = {
  isOauth: false,
  getData : function(login, callback){
    var https = require('https');
    var options = {
      host: 'api.github.com',
      port: '443',
      path: '/users/'+login+'/repos',
      method: 'GET',
      headers: {
        'User-Agent': login
      }
    };
    var rez = '';
    var request = https.request(options, function(res2){
      res2.setEncoding('utf8');

      res2.on('data', function (chunk) {
        rez += chunk;
      });
      res2.on('end', function () {
        callback(null,rez);
        console.log(rez);
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
    var dataFilePath = path.resolve('data/githubData.json');
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
  storeData: function(projects, callback){
    var path = require('path');
    var fs = require('fs');
    var currentDate = new Date();
    var data = {};
    data.projects = JSON.parse(projects);
    data.lastActualisation = currentDate.getTime();
    data = JSON.stringify(data);
    fs.writeFile(path.resolve('data/githubData.json'), data, function(err) {
      callback(err, data);
    });
  }
};

module.exports = github;