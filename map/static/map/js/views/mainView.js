define(["marionette", "js/views/mapView", "js/views/objectsView", "tpl!templates/main-view-template.tpl"],
    function (Marionette, MapView, ObjectsView, mainViewTpl) {
        var MainView = Marionette.View.extend({
            //template: _.template($('#main-view-template').html()),
            template: mainViewTpl,
            regions: {
                map: "#map-region",
                objects: "#objects-region"
            },
            className: "fullScreen",

            onRender() {
                console.log("Render main view");

                var mapRegion = this.getRegion('map');
                window.mapview = new MapView();
                mapRegion.show(window.mapview);

                var objectsRegion = this.getRegion('objects');
                objectsRegion.show(new ObjectsView());
            }
        });
        return MainView;
    }
)
;