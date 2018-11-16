define(["jquery",
        "marionette",
        "js/collections/typesList",
        "js/modelViews/typesListView",
        "tpl!templates/add-new-point-template.tpl"
    ],
    function($,
        Marionette,
        TypesList,
        TypesListView,
        AddNewPointTpl
    ) {

        var AddNewPointView = Marionette.View.extend({
            // template: _.template($('#add-new-point-template').html()),
            template: AddNewPointTpl,
            regions: {
                showType: '#add-type'
            },
            initialize() {

            },
            ui: {
                'header': '#add-element',
                'addName': '#add-name',
                'addDescription': '#add-description',
                'addPointLat': '#add-point-lat',
                'addPointLon': '#add-point-lon',
                'addType': '#add-type',
                'addForm': '#element-form',
                'addButton': '#add-button',
                'clearButton': '#clear-button',
                'body': '#add-element-card'
            },
            events: {
                'submit @ui.addForm': 'addPoint',
                'click @ui.clearButton': 'clearForm',
                'click @ui.header': 'toggleCard'
            },

            onRender() {
                var types = new TypesList();
                types.fetch();
                this.typesView = new TypesListView({
                    collection: types
                });
                var typeRegion = this.getRegion('showType');
                typeRegion.show(this.typesView);
            },

            clearForm: function(e) {
                e.preventDefault();
                console.log('Clear form');
                this.ui.addName.val("");
                this.ui.addDescription.val("");
                this.ui.addPointLon.val("");
                this.ui.addPointLat.val("");
                window.newPointSource.clear();
            },

            addPoint: function(e) {
                e.preventDefault();
                console.log('Add point');
                var name = this.ui.addName.val();
                var description = this.ui.addDescription.val();
                var lat = parseFloat(this.ui.addPointLat.val());
                var lon = parseFloat(this.ui.addPointLon.val());
                var type = parseInt(this.ui.addType.find("#type-list-container").val());
                if (!isNaN(lon) && !isNaN(lat)) {
                    window.objlist.create({
                        "name": name,
                        "description": description,
                        "type": type,
                        "geom": {
                            "type": "Point",
                            "coordinates": [
                                lat,
                                lon
                            ]
                        }
                    }, {
                        "wait": true
                    });

                    this.clearForm(e);
                    this.toggleCard();
                }
                else {
                    alert('Вы должны выбрать точку на карте!')
                }

            },
            toggleCard: function() {
                this.ui.body.slideToggle();
            }

        });
        return AddNewPointView;

    });