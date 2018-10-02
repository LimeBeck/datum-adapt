requirejs.config({
        paths: {
            json2: "js/lib/json2",
            text: "js/lib/text",
            tpl: "js/lib/underscore-tpl",
            underscore: "js/lib/underscore",
            backbone: "js/lib/backbone",
            jquery: "js/lib/jquery",
            ol: "js/lib/ol",
            marionette: "js/lib/backbone.marionette",
            'backbone.radio': "js/lib/backbone.radio",
            app: "js/app",
        },
        shim: {
            underscore: {
                exports: "_"
            },
            backbone: {
                deps: ["jquery", "underscore"],
                exports: "Backbone"
            },
            marionette: {
                deps: ["backbone", "backbone.radio"],
                exports: "Marionette"
            },
            ol: {
                exports: "ol"
            },
            tpl: ["text"]

        }
    }
);

require(["app", "js/utils"],
    function (App, utils, templates) {
        console.log(templates);
        utils.setToken();
        utils.setSlashes();
        var app = new App();
        app.start();

    });