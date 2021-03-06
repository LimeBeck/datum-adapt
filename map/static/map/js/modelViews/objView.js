define(["marionette",
        "ol",
        "js/models/types",
        "js/modelViews/typesView",
        "js/collections/typesList",
        "js/modelViews/typesListView",
        "js/utils",
        "tpl!templates/change-point-template.tpl",
        "tpl!templates/object-card-template.tpl"
    ],
    function (Marionette,
              ol,
              Types,
              TypesView,
              TypesList,
              TypesListView,
              utils,
              ChangePointTpl,
              ObjCardTpl
    ) {
        var ObjView = Marionette.View.extend({
            template: ObjCardTpl,
            regions: {
                showType: '#show-type-region'
            },
            childView: TypesView,
            ui:{
                'header': '.card-header',
                'changeName': '#change-name',
                'changeDescription': '#change-description',
                'changePointLat': '#change-point-lat',
                'changePointLon': '#change-point-lon',
                'changeType': '#show-type-region',
                'changeForm': '#change-form',
                'changeButton': '#change',                  
                'deleteButton': '#delete',                
                'saveButton': '#change-button',
                'cancelButton': '#cancel-button',
                'body': '.card-body'
            },
            events: {
                'click @ui.header': 'flyToMarker',
                'click @ui.deleteButton': 'deleteModel',
                'click @ui.cancelButton': 'cancel',
                'click @ui.saveButton': 'saveModel',
                'click @ui.changeButton': 'changeModel'
            },

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
                this.listenTo(this.model, 'add', this.render);

                // Make point from model`s coords
                this.point = ol.proj.fromLonLat(this.model.get('geom').coordinates);

                // Make marker at point
                this.marker = new ol.Feature({
                    geometry: new ol.geom.Point(this.point),
                    name: this.model.get('name'),
                    description: this.model.get('description'),
                    id: this.model.get('id'),
                    card: this
                });


                // Set style to marker
                if (0 < this.model.get('type') && this.model.get('type') < 5) {
                    var style_set = utils.styles[this.model.get('type')];
                }
                else {
                    var style_set = utils.styles["0"];

                }
                style_set.text = new ol.style.Text(utils.styleset.text);
                var style = new ol.style.Style(style_set);
                style.getText().setText(this.model.get('name'));
                this.marker.setStyle(style);

                // Add marker on markers layer
                var id = this.model.get('id');
                window.markersSource.forEachFeature(function (feature) {
                    if (feature.get("id") === id) {
                        window.markersSource.removeFeature(feature);
                    }
                });
                window.markersSource.addFeature(this.marker);

                this.render()
            },
            toChange: false,
            getTemplate: function () {
                if (!this.toChange) {
                    // return _.template($("#object-card-template").html());
                    return ObjCardTpl;
                } else {
                    //return _.template($("#change-point-template").html());
                    return ChangePointTpl;
                }
            },
            removeFeature() {
                var features = window.markersSource.getFeatures();
                if (features != null && features.length > 0) {
                    for (x in features) {
                        var properties = features[x].getProperties();
                        var id = properties.id;
                        if (id == this.model.get('id')) {
                            console.log(properties.id);
                            window.markersSource.removeFeature(features[x]);
                            //break;
                        }
                    }
                }
            },
            onRender() {
                // console.log('Show');

                var typeRegion = this.getRegion('showType');
                if (this.toChange) {
                    var types = new TypesList();
                    var model_type_id = this.model.get('type');
                    types.once('sync', function () {
                        types.findWhere({id: model_type_id}).set('selected', true);
                    });
                    types.fetch();
                    this.typesView = new TypesListView({collection: types});
                    typeRegion.show(this.typesView);
                }
                else {
                    var type = new Types({'id': this.model.get('type')});
                    type.fetch();
                    var typeObj = new TypesView({model: type});
                    typeRegion.show(typeObj)
                }
            },

            collapsed: true,

            flyToMarker: function (e) {
                console.log("Fly to marker");
                if (this.collapsed) {
                    //$(".collapse:visible").slideToggle();
                    $(e.currentTarget).parent().find(".collapse").slideToggle();
                    this.collapsed = false;

                    // Animate fly to marker
                    window.view.animate({
                            center: this.point,
                            duration: 500,
                            zoom: 18
                        }
                    );
                }
                else {
                    $(e.currentTarget).parent().find(".collapse").slideToggle();
                    this.collapsed = true;
                }
            },

            deleteModel: function (e) {
                // Delete model and remove marker
                console.log("Delete");
                //window.markersSource.removeFeature(this.marker);
                this.removeFeature();
                this.model.destroy();
            },

            changeModel: function (e) {
                // ToDo: Make changing here
                console.log("Change");
                this.toChange = true;
                this.render();
            },
            saveModel(e) {
                e.preventDefault();
                console.log("Save");
                var name = this.ui.changeName.val();
                var description = this.ui.changeDescription.val();
                var lat = parseFloat(this.ui.changePointLat.val());
                var lon = parseFloat(this.ui.changePointLon.val());
                var geom = {
                    "type": "Point",
                    "coordinates": [
                        lat,
                        lon
                    ]
                };
                var type = parseInt(this.ui.changeType.find("#type-list-container").val());
                var attrs = {};
                if (name !== this.model.get('name')) {
                    attrs.name = name;
                }
                if (description !== this.model.get('description')) {
                    attrs.description = description;
                }
                if ((geom.coordinates[0] !== this.model.get('geom').coordinates[0])
                    && (geom.coordinates[1] !== this.model.get('geom').coordinates[1])) {
                    attrs.geom = geom;
                }
                if (type !== this.model.get('type')) {
                    attrs.type = type;
                }
                if (Object.getOwnPropertyNames(attrs).length > 0) {
                    this.model.save(attrs, {patch: true});
                    window.newPointSource.clear();
                    window.markersSource.removeFeature(this.marker);
                }

                this.toChange = false;
                this.render();

                
            },
            cancel() {
                console.log("Cancel");
                this.toChange = false;
                this.render();
            }
        });

        return ObjView;
    });