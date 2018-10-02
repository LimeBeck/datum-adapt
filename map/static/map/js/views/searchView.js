define(["marionette",
        "tpl!templates/search-view-template.tpl"],
    function (Marionette,
              SearchViewTpl) {

    var SearchView = Marionette.View.extend({
        // template: _.template($("#search-view-template").html()),
        template: SearchViewTpl,
        events: {
            'keyup #search-field': 'filterData'
        },
        onRender() {
            console.log("Render Search view");
        },
        filterData() {
            // Filter objects by name
            var filter = function (view, index, children) {
                return view.model.get("name")
                    .toLowerCase().indexOf(
                        $("#search-field").val().toLowerCase()
                    ) > -1
            };
            window.objListView.setFilter(filter);
        }
    });

    return SearchView;

});