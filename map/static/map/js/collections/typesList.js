define(["backbone", "js/models/types"], function (Backbone, Types) {
    var TypesList = Backbone.Collection.extend({
        model: Types,
        url: 'types/'
    });

    return TypesList;
});