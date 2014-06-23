'use strict';
var dust = require('dustjs-linkedin');
dust.helpers.titlecase = function (chunk, context, bodies, params) {
  var text = dust.helpers.tap(params.text, chunk, context);
  return chunk.write(text.charAt(0).toUpperCase() + text.slice(1));
};

dust.helpers.getLastActualisation = function (chunk, context, bodies, params) {
  var scrappers = dust.helpers.tap(params.scrappers, chunk, context);
  var name = dust.helpers.tap(params.name, chunk, context);
  scrappers = JSON.parse(scrappers);
  var timestamp = scrappers[name+'Data'].lastActualisation;
  if(timestamp !== undefined){
    var moment = require('moment');
    timestamp = moment(timestamp/1000, 'X').fromNow();
  } else {
    timestamp = 'never';
  }
  return chunk.write(timestamp);
};

dust.helpers.scrapperIsNeeded = function (chunk, context, bodies, params) {
  var scrappers = dust.helpers.tap(params.scrappers, chunk, context);
  var name = dust.helpers.tap(params.name, chunk, context);
  scrappers = JSON.parse(scrappers);
  var required = '<span id="scrapperIsRequired_'+name+'" style="display:none;" class="scrapperIsRequired required">*</span>';
  if(scrappers[name]==='required'){
    required = '<span id="scrapperIsRequired_'+name+'" style="display:inline;" class="scrapperIsRequired required">*</span>';
  }
  return chunk.write(required);
};

dust.helpers.displayField = function (chunk, context, bodies, params) {
  var field = dust.helpers.tap(params.field, chunk, context);
  field = JSON.parse(field);
  var rez = '';
  if(field.display === 'input'){
    rez = '<input required type="'+field.type+'" name="themeCustomField_'+field.name+'" value="'+field.value+'"/>';
  } else {
    rez = '<textarea required name="themeCustomField_'+field.name+'">'+field.value+'</textarea>';
  }
  return chunk.write(rez);
};
