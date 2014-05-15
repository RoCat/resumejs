var linkedin = {
    getInfos: function(token, callback){
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
            'phone-numbers'

        var options = options = {
            host: 'api.linkedin.com',
            port: '443',
            path: '/v1/people/~:('+fields+')?format=json&oauth2_access_token='+token,
            method: 'GET'
        };
        var rez = "";
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
        request.on("error", function (err) {
            callback(err);
        });
        request.end();
    },
    getStoredInfo: function(){
        var fs = require('fs');
        var path = require('path');
        dataFilePath = path.resolve("data/linkedInInfo.json");
        if(fs.existsSync(dataFilePath)){
            var options = {
                encoding: "utf8"
            };
            var str = fs.readFileSync(dataFilePath, options);
            try {
                str = str.replace(/\\n/g, '<br \>');
                str =  JSON.parse(str);
                return str;
            } catch(exception) {
                return exception;
            }
        } else {
            return false;
        }
    }
};
module.exports = linkedin;