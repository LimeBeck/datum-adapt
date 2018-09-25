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

//var objlist = new ObjList(1);

const icons = {
    1: L.icon({
        iconUrl: 'static/map/css/images/icons8-park-bench-filled-50.png',
        iconSize: [25, 25],
        popupAnchor: [0, -12],
    }),
    2: L.icon({
        iconUrl: 'static/map/css/images/icons8-monument-filled-50.png',
        iconSize: [25, 25],
        popupAnchor: [0, -12],
    }),
    3: L.icon({
        iconUrl: 'static/map/css/images/icons8-library-filled-50.png',
        iconSize: [25, 25],
        popupAnchor: [0, -12],
    }),
    4: L.icon({
        iconUrl: 'static/map/css/images/icons8-barbell-filled-50.png',
        iconSize: [25, 25],
        popupAnchor: [0, -12],
    })
};


var ObjView = Marionette.View.extend({
    template: _.template($("#object-card-template").html()),

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);

        map_point = this.model.get('geom').coordinates;
        icon = this.model.get('type');
        if (icon < 0 && icon > 4) {
            icon = 1;
        }
        this.map_marker = L.marker(map_point, {icon: icons[icon]});
        window.obj_layer.addLayer(this.map_marker);
        var popup_text = `
            <p style="font-weight:900">` + this.model.get("name") + `</p>
            <p>` + this.model.get("description") + `</p>
        `;
        this.map_marker.bindPopup(popup_text);
    },
    events: {
        'click': 'flyToMarker'
    },
    flyToMarker: function () {
        window.map.flyTo(this.model.get('geom').coordinates, 18);
        $(".collapse").hide();
        $("#card-" + this.model.get('id')).toggle();
        this.map_marker.openPopup()
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
        var dstu_map = L.map('mapid').setView([47.240085, 39.710701], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'LimeBeck was here',
            maxZoom: 19
        }).addTo(dstu_map);
        var measureControl = new L.Control.Measure(
            {
                primaryLengthUnit: 'meters', secondaryLengthUnit: 'kilometers',
                primaryAreaUnit: 'sqmeters', secondaryAreaUnit: undefined, position: "topleft",
            }
        );
        measureControl.addTo(dstu_map);
        L.control.mousePosition().addTo(dstu_map);

        window.map = dstu_map;
        window.obj_layer = new L.featureGroup();
        window.map.addLayer(window.obj_layer);

        window.map.on(
            'zoomend', function(){
                if(window.map.getZoom()<15){
                    window.map.removeLayer(window.obj_layer);
                }
                else{
                    window.map.addLayer(window.obj_layer);
                }
            }
        )

        var objlist = new ObjList();
        var objListView = new ObjListView({collection: objlist});
        app.showView(objListView);
    }
});

var app = new App();

app.start()