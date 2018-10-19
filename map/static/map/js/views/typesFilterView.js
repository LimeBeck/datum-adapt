define(["marionette", "js/modelViews/typesView"],
    function (Marionette, TypesView) {
        var TypesFilterView = Marionette.CollectionView.extend({
            childView: TypesView,
            collectionEvents: {
                'sync': 'render'
            },
            viewComparator: "id",
            initialize() {
                this.collection.fetch();
                window.filterType = [];
            },
            onRender() {
                console.log("Render TypesFilter view");
            },
            childViewEventPrefix: 'childview',
            onChildviewClickFilter(childView) {
                console.log('Click Filter');
                var index = window.filterType.indexOf(childView.model.get('id'));
                if (index !== -1) {
                    window.filterType.splice(index, 1);

        } else {
          window.filterType.push(childView.model.get('id'));
        }
        if (window.filterType.length > 0) {
          var filter = function(view, index, children) {
            return window.filterType.includes(view.model.get("type"))
            //return view.model.get("type") === childView.model.get('id')
          };
          window.objListView.setFilter(filter);
        } else {
          window.objListView.removeFilter();
        }

      }
    });

    return TypesFilterView;
  });