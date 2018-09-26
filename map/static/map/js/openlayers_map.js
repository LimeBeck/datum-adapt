$(document).ajaxSend(function (event, request) {
    var token = "Token 695672c4e9320d30f7714b35b069b8857b6bd63c";
    if (token) {
        request.setRequestHeader("Authorization", token);
    }
});

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
            type: "1",
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
            size: [50, 50],
            scale: 0.7
        }))
    }),
    2: new ol.style.Style({
        image: new ol.style.Icon(({
            crossOrigin: 'anonymous',
            src: 'static/map/css/images/icons8-monument-filled-50.png',
            scale: 0.7
        }))
    }),
    3: new ol.style.Style({
        image: new ol.style.Icon(({
            crossOrigin: 'anonymous',
            src: 'static/map/css/images/icons8-library-filled-50.png',
            scale: 0.7
        }))
    }),
    4: new ol.style.Style({
        image: new ol.style.Icon(({
            crossOrigin: 'anonymous',
            src: 'static/map/css/images/icons8-barbell-filled-50.png',
            scale: 0.7
        }))
    })
};


var ObjView = Marionette.View.extend({
    template: _.template($("#object-card-template").html()),

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'add', this.render);
        this.point = ol.proj.fromLonLat(this.model.get('geom').coordinates);
        console.log(this.model.get('geom').coordinates + " || " + this.point);
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
        this.render()
    },
    events: {
        'click': 'flyToMarker',
        'click #delete': 'deleteModel',
        'click #change': 'changeModel'
    },
    flyToMarker: function (e) {
        console.log("fly");
        window.view.animate({
                center: this.point,
                duration: 500,
                zoom: 18
            }
        );
        $(".collapse").hide();
        $(e.currentTarget).find(".collapse").toggle();
    },
    deleteModel: function (e) {
        console.log(this.model);
    },
    changeModel: function (e) {
        console.log(this.model);
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
                    source: new ol.source.OSM({crossOrigin: 'anonymous'})
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


        var newPointSource = new ol.source.Vector({});

        var newPointLayer = new ol.layer.Vector({
            source: newPointSource
        });

        window.map.addLayer(newPointLayer);

        window.map.on("click", function (e) {
            var latlon = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
            $("#add-point-lat").val(latlon[0]);
            $("#add-point-lon").val(latlon[1]);
            var newPoint = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(latlon))
            });
            newPoint.setStyle(new ol.style.Style({
                image: new ol.style.Icon(({
                    crossOrigin: 'anonymous',
                    src: 'static/map/css/images/hospital.png',
                    size: [128, 128],
                    scale: 0.4,
                    anchor: [0.5, 1]
                }))
            }));
            console.log(newPoint);
            newPointSource.clear();
            newPointSource.addFeature(newPoint)
        });


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

        $("#element-form").submit(function (e) {
            e.preventDefault();
            var name = $("#add-name").val();
            var description = $("#add-description").val();
            var lat = parseFloat($("#add-point-lat").val());
            var lon = parseFloat($("#add-point-lon").val());

            objlist.create({
                "name": name,
                "description": description,
                "type": 1,
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        lat,
                        lon
                    ]
                }
            }, {"wait": true});

            $("#add-name").val("");
            $("#add-description").val("");
            $("#add-point-lat").val("");
            $("#add-point-lon").val("");
            newPointSource.clear();
        });

        $("#add-element").click(function () {
            $("#add-element-card").slideToggle();
        });

    }
});

var app = new App();

app.start();


