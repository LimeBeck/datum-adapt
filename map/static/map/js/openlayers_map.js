var Types = Backbone.Model.extend({
    defaults: function () {
        return {
            name: "Default type name",
            description: "Default type description"
        };
    }
});

var Objects = Backbone.Model.extend({
    defaults: function () {
        return {
            name: "Default object name",
            type: "0",
            description: "Default object description",
            geom: {
                'type': 'Point',
                'coordinates': [
                    0.0,
                    0.0
                ]
            }
        }
    }
});

var ObjList = Backbone.Collection.extend({
    model: Objects,
    url: 'objects/'
});

var styles = {
    1: new ol.style.Style({
        image: new ol.style.Icon(({
            crossOrigin: 'anonymous',
            src: 'static/map/css/images/icons8-park-bench-filled-50.png',
            size: [50, 50]
        }))
    }),
    2: new ol.style.Style({
        image: new ol.style.Icon(({
            crossOrigin: 'anonymous',
            src: 'static/map/css/images/icons8-monument-filled-50.png'
        }))
    }),
    3: new ol.style.Style({
        image: new ol.style.Icon(({
            crossOrigin: 'anonymous',
            src: 'static/map/css/images/icons8-library-filled-50.png'
        }))
    }),
    4: new ol.style.Style({
        image: new ol.style.Icon(({
            crossOrigin: 'anonymous',
            src: 'static/map/css/images/icons8-barbell-filled-50.png'
        }))
    })
}


var ObjView = Marionette.View.extend({
    template: _.template($("#object-card-template").html()),

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.point = ol.proj.fromLonLat(this.model.get('geom').coordinates.slice().reverse());
        var marker = new ol.Feature({
            geometry: new ol.geom.Point(this.point)
        });
        if (0 < this.model.get('type') < 5) {
            marker.setStyle(styles[this.model.get('type')]);
        }
        else {
            marker.setStyle(styles["1"]);
        }


        window.markersSource.addFeature(marker)

    },
    events: {
        'click': 'flyToMarker'
    },
    flyToMarker: function () {

        // point = ol.proj.fromLonLat(this.model.get('geom').coordinates.slice().reverse());
        // console.log(point);
        window.view.animate({
                center: this.point,
                duration: 500,
                zoom: 18
            }
        );
        $(".collapse").hide();
        $("#card-" + this.model.get('id')).toggle();
    }
});

var ObjListView = Marionette.CollectionView.extend({
    childView: ObjView,

    childViewContainer: '#obj-list',
    template: _.template($('#obj-list-template').html()),
    collectionEvents: {
        'sync': 'render'
    },
    initialize() {
        this.collection.fetch();
    },
    viewComparator: "type"
});


var App = Marionette.Application.extend({
    region: '#inner-objects',

    onStart: function (app) {
        window.view = new ol.View({
            center: ol.proj.fromLonLat([39.710701, 47.240085]),
            zoom: 17
        });
        window.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: window.view
        });

        window.markersSource = new ol.source.Vector({});

        var markersLayer = new ol.layer.Vector({
            source: window.markersSource
        });

        window.map.addLayer(markersLayer);


        window.map.on(
            'moveend', function () {
                // console.log("Zoom:" + window.view.getZoom())
                if (window.view.getZoom() < 15) {
                    markersLayer.setVisible(false)
                }
                else {
                    markersLayer.setVisible(true)
                }
            }
        );

        var objlist = new ObjList();
        var objListView = new ObjListView({collection: objlist});
        app.showView(objListView);


        $("#search-field").on("keyup", function () {
            console.log('Change');
            var filter = function (view, index, children) {
                return view.model.get("name")
                    .toLowerCase().indexOf(
                        $("#search-field").val().toLowerCase()
                    ) > -1
            };
            objListView.setFilter(filter);
        });

        $('#search-button').on("click", function () {
            console.log("Click");
        });
    }
});

var app = new App();

app.start();
