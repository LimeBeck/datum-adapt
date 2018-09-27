//Add custom Auth header for work with Token Auth
$(document).ajaxSend(function (event, request) {
    var token = "Token 695672c4e9320d30f7714b35b069b8857b6bd63c";
    if (token) {
        request.setRequestHeader("Authorization", token);
    }
});

// Types Backbone model
var Types = Backbone.Model.extend({
    urlRoot: '/types',
    defaults: function () {
        return {
            name: "Default type name",
            description: "Default type description"
        };
    }
});

var TypesList = Backbone.Collection.extend({
    model: Types,
    url: 'types/'
});

var TypesView = Marionette.View.extend({
    template: _.template($("#type-template").html()),
    initialize: function () {
        this.listenTo(this.model, 'sync', this.render);
    }
});

var TypesForListView = Marionette.View.extend({
    template: _.template($("#type-for-list-template").html()),
    initialize: function () {
        this.listenTo(this.model, 'sync', this.render);
    }
});


var TypesListView = Marionette.CollectionView.extend({
    childView: TypesForListView,
    childViewContainer: '#type-list-container',
    template: _.template($('#type-list-template').html()),
    region: "add-type"
});

// Objects Backbone model
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

//Objects Collection
var ObjList = Backbone.Collection.extend({
    model: Objects,
    url: 'objects/'
});

// Define styles for icons
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

// Objects Marionette view
var ObjView = Marionette.View.extend({
    // Template get with jQuery, cos default underscore not working
    template: _.template($("#object-card-template").html()),
    regions: {
        showType: '#show-type-region'
    },
    childView: TypesView,

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'add', this.render);

        // Make point from model`s coords
        this.point = ol.proj.fromLonLat(this.model.get('geom').coordinates);
        // console.log(this.model.get('geom').coordinates + " || " + this.point);

        // Make marker at point
        this.marker = new ol.Feature({
            geometry: new ol.geom.Point(this.point),
            name: this.model.get('name'),
            description: this.model.get('description')
        });

        // Set style to marker
        if (0 < this.model.get('type') < 5) {
            this.marker.setStyle(styles[this.model.get('type')]);
        }
        else {
            this.marker.setStyle(styles["1"]);
        }

        // Add marker on markers layer
        window.markersSource.addFeature(this.marker);
        this.render()
    },

    onRender() {
        // console.log('Show');
        var type = new Types({'id': this.model.get('type')});
        type.fetch();
        var typeObj = new TypesView({model: type});
        // console.log(typeObj);
        var typeRegion = this.getRegion('showType');
        typeRegion.show(typeObj)
    },

    events: {
        'click': 'flyToMarker',
        'click #delete': 'deleteModel',
        'click #change': 'changeModel'
    },

    flyToMarker: function (e) {
        // Animate fly to marker
        window.view.animate({
                center: this.point,
                duration: 500,
                zoom: 18
            }
        );
        //Left opened only this card
        if ($(e.currentTarget).find(':hidden').length > 0) {
            $(".collapse:visible").slideToggle();
            $(e.currentTarget).find(".collapse").slideToggle();
        }


    },

    deleteModel: function (e) {
        // Delete model and remove marker
        this.model.destroy();
        window.markersSource.removeFeature(this.marker);
    },

    changeModel: function (e) {
        // ToDo: Make changing here
        console.log("Change");
    }
});


//Objects Marionette collection view
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


var AddNewPointView = Marionette.View.extend({
    template: _.template($('#add-point-template').html()),
    region: '#add-element',
    initialize() {

    },
    events: {
        'submit #element-form': 'addPoint',
        'click #add-element': 'toggleCard'
    },
    addPoint: function (e) {
        e.preventDefault();
        var name = $("#add-name").val();
        var description = $("#add-description").val();
        var lat = parseFloat($("#add-point-lat").val());
        var lon = parseFloat($("#add-point-lon").val());

        window.objlist.create({
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
        window.newPointSource.clear();
    },
    toggleCard: function () {
        $("#add-element-card").slideToggle();
    }

});


var MainView = Marionette.View.extend({

});


// Root app
// ToDo: make view to show in app, not render stuff into
var App = Marionette.Application.extend({
    region: '#inner-objects',

    onStart: function (app) {

        // Add map
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

        // Make layer with markers and add it to the map
        var markersLayer = new ol.layer.Vector({
            source: window.markersSource
        });

        window.map.addLayer(markersLayer);

        // Listen to moving map (cos openlayers dont have zoom event) and decide to hide markers
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

        // Make different layer for new point
        window.newPointSource = new ol.source.Vector({});

        var newPointLayer = new ol.layer.Vector({
            source: window.newPointSource
        });

        window.map.addLayer(newPointLayer);

        // Add new point on map by click and write it coords in form
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
            window.newPointSource.clear();
            window.newPointSource.addFeature(newPoint)
        });


        // Get data from server
        window.objlist = new ObjList();
        var objListView = new ObjListView({collection: window.objlist});
        app.showView(objListView);


        // Other page stuff:
        // Filter objects by name
        $("#search-field").on("keyup", function () {
            var filter = function (view, index, children) {
                return view.model.get("name")
                    .toLowerCase().indexOf(
                        $("#search-field").val().toLowerCase()
                    ) > -1
            };
            objListView.setFilter(filter);
        });

        // Add new object
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
            window.newPointSource.clear();
        });

        // Toggle new object card
        $("#add-element").click(function () {
            $("#add-element-card").slideToggle();
        });

    }
});

var app = new App();

app.start();


