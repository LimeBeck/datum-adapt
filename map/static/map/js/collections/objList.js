define(["backbone", "js/models/objects"], function (Backbone, Objects) {
    var ObjList = Backbone.Collection.extend({
        model: Objects,
        url: 'objects/'
    });

    return ObjList
});