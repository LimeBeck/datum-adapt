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


var ObjView = Marionette.View.extend({
    template: _.template($("#object-card-template").html()),

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.point = ol.proj.fromLonLat(this.model.get('geom').coordinates.slice().reverse());
        var marker = new ol.Feature({
            geometry: new ol.geom.Point(this.point)
        });
        marker.setStyle(new ol.style.Style({
            image: new ol.style.Icon(({
                color: '#ffcd46',
                crossOrigin: 'anonymous',
                src: 'static/map/css/images/icons8-park-bench-filled-50.png'
            }))
        }));

        var markersSource = new ol.source.Vector({
            features: [marker]
        });

        var markersLayer = new ol.layer.Vector({
            source: markersSource
        });
        window.map.addLayer(markersLayer);
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
    template: _.template(`
        <div id="obj-list">
        </div>
    `),
    collectionEvents: {
        'sync': 'render'
    },
    initialize() {
        this.collection.fetch();
    },
})


var App = Marionette.Application.extend({
    region: '#objects',

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


        window.map.on(
            'zoomend', function () {
                // ToDo: Add layer disapeared here
            }
        )

        var objlist = new ObjList();
        var objListView = new ObjListView({collection: objlist});
        app.showView(objListView);
    }
});

var app = new App();

app.start()