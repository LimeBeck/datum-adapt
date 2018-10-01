requirejs.config({
        paths: {
            json2: "js/lib/json2",
            underscore: "js/lib/underscore",
            backbone: "js/lib/backbone",
            jquery: "js/lib/jquery",
            ol: "js/lib/ol"
        },
        shim: {
            underscore: {
                exports: "_"
            },
            backbone: {
                deps: ["jquery", "underscore"],
                exports: "Backbone"
            },

        }
    }
);

require(["jquery", "underscore", "backbone", "ol"],
    function ($, _, Backbone, ol) {
       // Types Backbone model
        var Types = Backbone.Model.extend({
            urlRoot: '/types',
            defaults: function () {
                return {
                    name: "Default type name",
                    description: "Default type description",
                    selected: false,
                };
            }
        });
        types = new Types({'id':2}).fetch();
        console.log(types);
    });