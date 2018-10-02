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
            // Template get with jQuery, cos default underscore not working
            // template: _.template($("#object-card-template").html()),
            template: ObjCardTpl,
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

                // Make marker at point
                this.marker = new ol.Feature({
                    geometry: new ol.geom.Point(this.point),
                    name: this.model.get('name'),
                    description: this.model.get('description'),
                    id: this.model.get('id'),
                });

                // Set style to marker
                if (0 < this.model.get('type') < 5) {
                    this.marker.setStyle(utils.styles[this.model.get('type')]);
                }
                else {
                    this.marker.setStyle(utils.styles["1"]);
                }

                // Add marker on markers layer
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


            events: {
                'click .card-header': 'flyToMarker',
                'click #delete': 'deleteModel',
                'click #cancel-button': 'cancel',
                'click #change-button': 'saveModel',
                'click #change': 'changeModel'
            },
            collapsed: true,
            flyToMarker: function (e) {
                //console.log(this.marker);
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
                var name = $("#change-name").val();
                var description = $("#change-description").val();
                var lat = parseFloat($("#change-point-lat").val());
                var lon = parseFloat($("#change-point-lon").val());
                var geom = {
                    "type": "Point",
                    "coordinates": [
                        lat,
                        lon
                    ]
                };
                var type = parseInt($("#show-type-region #type-list-container").val());
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
                }

                this.toChange = false;
                this.render();

                window.newPointSource.clear();
                window.markersSource.removeFeature(this.marker);
            },
            cancel() {
                console.log("Cancel");
                this.toChange = false;
                this.render();
            }
        });

        return ObjView;
    });