define(["backbone"], function (Backbone) {
    var Types = Backbone.Model.extend({
        urlRoot: '/types',
        defaults: function () {
            return {
                name: "Default type name",
                description: "Default type description",
                selected: false,
            };
        }
    });

    return Types;
});