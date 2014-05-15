'use strict';
var apps = {
    init: function(){
        $('#refresh').on('click', function(){
            $.ajax({ url: '/getInfos'}).done(function(data){
                console.log(data);
            });
        });
    }
};
apps.init();