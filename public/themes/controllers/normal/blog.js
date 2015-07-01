var path = require('path');
var fs = require('fs');
var marked = require('marked');
var moment = require('moment');
var lodash = require('lodash');

module.exports = function(app){
  var blog = {
    get: function(req, res){
      var themeLib = require(global.__root+'/lib/theme.js');

      var isApi = req.query.isApi;
      var requestedCategory = req.query.category;
      var requestedArticle = req.query.article;

      var model = req.model;
      var themedController = req.themedController;
      var theme = model.adminData.theme;
      //get all articles
      var articles = [];
      var categories = [];
      var articlesDir = global.__root+'/data/themes/'+theme+'/blog/';
      if(fs.existsSync(articlesDir)){
        var articleFiles = fs.readdirSync(articlesDir);
        articleFiles.forEach(function(article){
          articleName = article.replace(/\.[^/.]+$/, "");
          var articleObj = {};
          articleObj.publicationDate = articleName.split('_')[0];
          articleObj.category = articleName.split('_')[1];
          articleObj.title = articleName.split('_')[2];
          if(!articleObj.category){
            articleObj.category = articleObj.publicationDate;
            articleObj.publicationDate = 0;
          }
          if(!articleObj.title){
            articleObj.title = articleObj.category;
            articleObj.category = null;
          }
          articleObj.content = marked(fs.readFileSync(articlesDir+'/'+article, 'utf8')).replace('\n', '<br />');
          if(articleObj.publicationDate <= Date.now()/1000) {
            categories.push(articleObj.category.charAt(0).toUpperCase() + articleObj.category.slice(1));
            if (!articleObj.category || !requestedCategory || requestedCategory === "list"
              || requestedCategory.toLowerCase() === articleObj.category.toLowerCase()) {
              articleObj.publicationDate = moment(new Date(articleObj.publicationDate * 1000)).fromNow();
              articleObj.title = articleObj.title.charAt(0).toUpperCase() + articleObj.title.slice(1);
              articles.push(articleObj);
            }
          }
        })
      }
      model.categories = lodash.uniq(categories);
      model.articles = articles;
      var themedView = themeLib.getThemedView(themedController, app.settings);
      themeLib.getThemeData(model.adminData.theme, true, function(err,themeData){
        model.themeData = themeData;
        if(!isApi){
          res.render(themedView, model);
        } else {
          var returnObj = articles;
          if(requestedArticle){
            returnObj = articles[requestedArticle];
          } else {
            if(requestedCategory){
              if(requestedCategory === "list"){
                var allCategories = lodash.countBy(articles,"category");
                returnObj = [];
                for(var categoryKey in allCategories){
                  returnObj.push({name: categoryKey, count: allCategories[categoryKey]});
                }
              } else {
                returnObj = articles;
              }
            } else {
              returnObj = articles;
            }
          }
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(returnObj);
        }
      });
    }
  };
  return blog;
}
