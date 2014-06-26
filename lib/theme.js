'use strict';
var fs = require('fs');
var path = require('path');
var themeLib = {
  getThemedView: function(view, settings){
    var theme = 'normal';
    if(fs.existsSync('data/adminData.json')){
      var adminData = JSON.parse(fs.readFileSync('data/adminData.json', 'utf8').replace(/\\n/g, '<br />'));
      theme = adminData.theme;
    }
    if(fs.existsSync(path.join(settings.views,'themes/'+theme+'/'+view))){
      return  'themes/'+theme+'/'+view;
    } else {
      return 'themes/'+theme+'/'+view+'.dust';
    }
  },
  getThemeModel: function(theme, callback){
    if(!theme){
      callback('theme needed');
    } else {
      if(fs.existsSync('data/themes/'+theme+'/model.json')){
        var themeModel = fs.readFileSync('data/themes/'+theme+'/model.json','utf8');
        try {
          themeModel = JSON.parse(themeModel);
        } catch(e)
        {
          callback(theme+' theme model is not a valid json');
        }
        if(typeof themeModel === 'object'){
          callback(null, themeModel);
        }
      } else {
        callback('this theme has no model');
      }
    }
  },
  getThemeData: function(theme, callback){
    themeLib.getThemeModel(theme, function(err,themeModel){
      if(err){
        callback(err);
      } else {
        var themeData = {};
        var tempData = {};
        if(fs.existsSync('data/themes/'+theme+'/data.json')){
          tempData = fs.readFileSync('data/themes/'+theme+'/data.json','utf8');
          try {
            tempData = JSON.parse(tempData);
          } catch(e)
          {
            tempData = {};
          }
        }
        themeData.usedScrappers = themeModel.usedScrappers;
        themeData.customFields = {};
        themeData.customFieldsArray = [];
        for(var fieldKey in themeModel.customFields){
          var temp = themeModel.customFields[fieldKey];
          temp.name= fieldKey;
          temp.value = (tempData[fieldKey]) ? tempData[fieldKey] : themeModel.customFields[fieldKey].default;
          temp.value = temp.value.replace(/(\r\n|\n|\r)/gm, '<br />');
          themeData.customFields[temp.name] = (temp);
          themeData.customFieldsArray.push(temp);
        }
        callback(null, themeData);
      }
    });
  },
  storeData: function(theme, data, callback){
    if(theme && fs.existsSync('data/themes/'+theme+'/model.json')){
      data = JSON.stringify(data);
      fs.writeFile(path.resolve('data/themes/'+theme+'/data.json'), data, function(err) {
        callback(err, data);
      });
    } else {
      callback('valid theme needed');
    }
  }
};
module.exports = themeLib;