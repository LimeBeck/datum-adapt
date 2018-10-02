define(["marionette",
        "js/views/searchView",
        "js/views/addNewPointView",
        "js/views/innerView",
        "js/views/typesFilterView",
        "js/collections/typesList",
        "tpl!templates/objects-view-template.tpl"
    ],
    function (Marionette,
              SearchView,
              AddNewPointView,
              InnerView,
              TypesFilterView,
              TypesList,
              ObjectViewTpl) {
        var ObjectsView = Marionette.View.extend({
            // template: _.template($("#objects-view-template").html()),
            template: ObjectViewTpl,
            regions: {
                search: "#search-region",
                addNewPoint: "#add-new-point-region",
                inner: "#inner-region",
                typesFilter: '#types-filter-region'
            },
            onRender() {
                console.log("Render Objects view");

                var searchRegion = this.getRegion('search');
                searchRegion.show(new SearchView());

                var addNewRegion = this.getRegion('addNewPoint');
                addNewRegion.show(new AddNewPointView());

                var innerRegion = this.getRegion('inner');
                innerRegion.show(new InnerView());

                var types = new TypesList();
                var typesRegion = this.getRegion('typesFilter');
                typesRegion.show(new TypesFilterView({collection: types}));
            }
        });

        return ObjectsView;
    });