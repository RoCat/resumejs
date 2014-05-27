var scrappers = {
    getScrappersData: function(){
        var fs = require('fs');
        var path = require('path');
        var scrappersFiles = fs.readdirSync('lib/scrappers/');
        var result = {};
        for(var key in scrappersFiles){
            if(scrappersFiles[key].substr(-3) === '.js'){
                var tempLib = require(path.join('../lib/scrappers/', scrappersFiles[key]));
                var tempLibName = scrappersFiles[key].substr(0, scrappersFiles[key].length-3)+"Data";
                if(typeof tempLib === "object" && typeof tempLib.getStoredData === "function"){
                    result[tempLibName] = tempLib.getStoredData();
                }
            }
        }
        return result;
    },
    getScrappers: function(){
        var fs = require('fs');
        var path = require('path');
        var scrappersFiles = fs.readdirSync('lib/scrappers/');
        var result = [];
        for(var key in scrappersFiles){
            if(scrappersFiles[key].substr(-3) === '.js'){
                var tempLibName = scrappersFiles[key].substr(0, scrappersFiles[key].length-3);
                result.push(tempLibName);
            }
        }
        return result;
    },
    getScrappersConfig: function(){
        var fs = require('fs');
        var path = require('path');
        var scrappersFiles = fs.readdirSync('lib/scrappers/');
        var result = {};
        for(var key in scrappersFiles){
            if(scrappersFiles[key].substr(-5) === '.json'){
                var tempLib = require(path.join('../lib/scrappers/', scrappersFiles[key]));
                var tempLibName = scrappersFiles[key].substr(0, scrappersFiles[key].length-5);
                if(typeof tempLib === "object"){
                    result[tempLibName] = tempLib;
                }
            }
        }
        return result;
    },
    getScrapper: function(scrapper){
        var fs = require('fs');
        var path = require('path');
        var scrapperLibDir = path.join('lib/scrappers/');
        scrapperLibDir = path.resolve(scrapperLibDir);
        if(typeof scrapper === 'string'){
            if(fs.existsSync(path.join(scrapperLibDir, scrapper+'.js'))){
                var scrapperObj = require(path.join(scrapperLibDir, scrapper+'.js'));
                return scrapperObj;
            }
        } else {
            return false;
        }
    }
}
module.exports = scrappers;