define(["marionette",
        "js/collections/objList",
        "js/modelViews/objListView",
        "tpl!templates/inner-view-template.tpl",
    ],
    function (Marionette,
              ObjList,
              ObjListView,
              InnerViewTpl
    ) {
    var InnerView = Marionette.View.extend({
        // template: _.template($("#inner-view-template").html()),
        template: InnerViewTpl,
        regions: {main: "#inner-objects"},
        onRender() {
            console.log("Render Inner view");
            // Get data from server
            window.objlist = new ObjList();
            window.objListView = new ObjListView({collection: window.objlist});
            var innerRegion = this.getRegion('main');
            innerRegion.show(window.objListView);
        }
    });
    return InnerView;
});