var dust = require("dustjs-linkedin");
dust.helpers.titlecase = function (chunk, context, bodies, params) {
    var text = dust.helpers.tap(params.text, chunk, context);
    return chunk.write(text.charAt(0).toUpperCase() + text.slice(1));
}

dust.helpers.getLastActualisation = function (chunk, context, bodies, params) {
    var scrappers = dust.helpers.tap(params.scrappers, chunk, context);
    var name = dust.helpers.tap(params.name, chunk, context);
    scrappers = JSON.parse(scrappers);
    console.log(scrappers[name+"Data"].lastActualisation);
    var timestamp = scrappers[name+"Data"].lastActualisation;
    if(timestamp !== undefined){
        var moment = require('moment');
        timestamp = moment(timestamp/1000, "X").fromNow();
    } else {
        timestamp = "never";
    }
    return chunk.write(timestamp);
}