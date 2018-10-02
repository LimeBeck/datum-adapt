define(["marionette", "js/views/mainView", "js/utils"],
    function (Marionette, MainView) {
    var App = Marionette.Application.extend({
        region: '#container',

        onStart: function (app) {

            app.showView(new MainView());
            window.mapview.addmap();
        }
    });

    //var app = new App();

    return App;
});