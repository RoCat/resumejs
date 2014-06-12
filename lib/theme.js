'use strict';
var themeLib = {
  getThemedView: function(view, settings){
    var fs = require('fs');
    var path = require('path');
    var theme = 'normal';
    if(fs.existsSync('data/adminData.json')){
      var adminData = JSON.parse(fs.readFileSync('data/adminData.json', 'utf8').replace(/\\n/g, '<br />'));
      theme = adminData.template;
    }
    if(fs.existsSync(path.join(settings.views,'themes/'+theme+'/'+view))){
      return  'themes/'+theme+'/'+view;
    } else {
      return 'themes/'+theme+'/'+view+'.dust';
    }
  }
};
module.exports = themeLib;