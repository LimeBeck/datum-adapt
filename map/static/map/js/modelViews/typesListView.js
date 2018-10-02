define(["marionette",
        "js/modelViews/typesForListView",
        "tpl!templates/type-list-template.tpl"
    ],
    function (Marionette,
              TypesForListView,
              TypeListTpl
    ) {
        var TypesListView = Marionette.CollectionView.extend({
            childView: TypesForListView,
            childViewContainer: '#type-list-container',
            // template: _.template($('#type-list-template').html()),
            template: TypeListTpl,
            collectionEvents: {
                'sync': 'render'
            },
            initialize() {
                this.collection.fetch();
            }
        });

        return TypesListView;
    })