'use strict';


var app = require('../index'),
  kraken = require('kraken-js'),
  request = require('supertest'),
  wrench = require('wrench'),
  less = require('less'),
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  publicDir= path.resolve('./public'),
  buildsDir= path.resolve('./builds'),
  adminLib = require(path.resolve('./lib/admin.js')),
  adminData = adminLib.getStoredData(),
  currentTheme = adminData.theme,
  themeData = require(path.resolve('./data/themes/'+adminData.theme+'/model.json')),
  currentBuildDir= path.resolve(buildsDir+'/'+'latest');//+new Date().getTime());




module.exports = function (grunt) {

  grunt.registerMultiTask('static_generator', 'a tool to generate static files from requests call', function(){
    var done = this.async();
    prepareDirectory();
    kraken.create(app).listen(function (err, server) {
      var authenticatedRequest = request(server);
      async.eachSeries(themeData.staticPagesToGenerate, function(pageCeil, cb){
        authenticatedRequest.get(pageCeil).end(function(err,data){
          if(data && data.text){
            var pageName = pageCeil;
            if(pageCeil === '/'){
              pageName = '/index.html';
            }
            if(data.res.statusCode === 302){
              data.text='<script>window.location="'+data.res.headers.location+'";</script>'
            }
            fs.writeFile(path.resolve(currentBuildDir)+pageName, data.text, function(err,data){
              cb(null);
            });
          } else {
            console.log('the route you specified is not availlable');
            cb(false);
          }
        });
      }, function(err){
        server.close();
        done(err);
      });
    });
  });
};


var prepareDirectory = function(){
  wrench.copyDirSyncRecursive(publicDir, currentBuildDir, {forceDelete: true, inflateSymlinks: true});
  parseCSS(currentBuildDir+'/css')
}

var parseCSS = function(file){
  if(fs.lstatSync(file).isDirectory()){
    var files = fs.readdirSync(file);
    for(var fileKey in files){
      parseCSS(file+'/'+files[fileKey]);
    }
  } else {
    if(file.substr(-5) === '.less'){
      var content = fs.readFileSync(file, 'utf8');
      less.render(content, function (e, css) {
        var cssFile = file.substr(0, file.length-5)+'.css';
        fs.writeFileSync(cssFile, css);
        console.log(cssFile);
      });
    }
  }
}