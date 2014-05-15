'use strict';



module.exports = function (app) {

    var consumerKey = '75wmm7yzmoh1lr'
        , consumerSecret = 'OYzMys4V3XqgksAn'
        , callbackURL = "http%3A%2F%2Flocalhost.wyplay.com%3A8000%2Fauth";



    app.get('/auth', function (req, res) {
        if(req.session.isAdmin){
            if(!req.query.code){
                console.log('passage1');
                res.redirect('https://www.linkedin.com/uas/oauth2/authorization?response_type=code'
                    +'&client_id='+consumerKey
                    +'&state=toto'
                    +'&scope=r_contactinfo+r_fullprofile+r_emailaddress'
                    +'&redirect_uri='+(callbackURL));
            } else {
                console.log('passage2');
                var https = require('https');
                var querystring = require('querystring');
                var post_data = querystring.stringify({
                });
                var options = {
                    host: 'www.linkedin.com',
                    port: '443',
                    path: '/uas/oauth2/accessToken?grant_type=authorization_code'
                        +'&client_id='+consumerKey
                        +'&client_secret='+consumerSecret
                        +'&state='+'toto'
                        +'&code='+req.query.code
                        +'&redirect_uri='+callbackURL,
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
                            req.session.token = rez.access_token;
                            res.redirect('/getInfos');
                        } else {
                            res.send(rez);
                        }
                    });
                    res2.on('error',function(err){console.log(err);})
                });
                request.write(post_data);
                request.end();
                request.on('error', function(err){
                    res.send(err);
                });
            }
        } else {
            res.redirect('/login');
        }
    });


};

