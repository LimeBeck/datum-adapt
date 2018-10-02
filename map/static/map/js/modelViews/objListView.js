define(["marionette",
        "js/modelViews/objView",
        "tpl!templates/obj-list-template.tpl"
    ],
    function (Marionette,
              ObjView,
              ObjListTpl
    ) {
        var ObjListView = Marionette.CollectionView.extend({
            // template: _.template($('#obj-list-template').html()),
            template: ObjListTpl,
            childView: ObjView,
            childViewContainer: '#obj-list',

            collectionEvents: {
                'sync': 'render'
            },
            initialize() {
                this.collection.fetch();
            },
            viewComparator: "type"
        });

        return ObjListView;
    });