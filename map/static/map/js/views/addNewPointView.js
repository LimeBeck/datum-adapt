define(["jquery",
        "marionette",
        "js/collections/typesList",
        "js/modelViews/typesListView",
        "tpl!templates/add-new-point-template.tpl"],
    function ($,
              Marionette,
              TypesList,
              TypesListView,
              AddNewPointTpl
    ) {

        var AddNewPointView = Marionette.View.extend({
            // template: _.template($('#add-new-point-template').html()),
            template: AddNewPointTpl,
            regions: {showType: '#add-type'},
            initialize() {

            },
            events: {
                'submit #element-form': 'addPoint',
                'click #clear-button': 'clearForm',
                'click #add-element.card-header': 'toggleCard'
            },

            onRender() {
                var types = new TypesList();
                types.fetch();
                this.typesView = new TypesListView({collection: types});
                var typeRegion = this.getRegion('showType');
                typeRegion.show(this.typesView);
            },

            clearForm: function (e) {
                e.preventDefault();
                console.log('Clear form');
                $("#add-name").val("");
                $("#add-description").val("");
                $("#add-point-lat").val("");
                $("#add-point-lon").val("");
                window.newPointSource.clear();
            },

            addPoint: function (e) {
                e.preventDefault();
                console.log('Add point');
                var name = $("#add-name").val();
                var description = $("#add-description").val();
                var lat = parseFloat($("#add-point-lat").val());
                var lon = parseFloat($("#add-point-lon").val());
                var type = parseInt($("#type-list-container").val());

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
                }, {"wait": true});

                this.clearForm(e);
                this.toggleCard();
            },
            toggleCard: function () {
                $("#add-element-card").slideToggle();
            }

        });
        return AddNewPointView;

    });