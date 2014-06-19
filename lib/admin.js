'use strict';
var admin = {
  getStoredData: function(stringifyTextarea){
    var fs = require('fs');
    var path = require('path');
    var dataFilePath = path.resolve('data/adminData.json');
    if(fs.existsSync(dataFilePath)){
      var options = {
        encoding: 'utf8'
      };
      var str = fs.readFileSync(dataFilePath, options);
      try {
        if(stringifyTextarea === true){
          str = str.replace(/\\n/g, '<br />');
        }
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
    fs.writeFile(path.resolve('data/adminData.json'), data, function(err) {
      callback(err, data);
    });
  }
};

module.exports = admin;