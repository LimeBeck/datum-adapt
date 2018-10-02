define(["backbone"], function (Backbone) {
    var Objects = Backbone.Model.extend({
        defaults: function () {
            return {
                name: "Default object name",
                type: "1",
                description: "Default object description",
                geom: {
                    'type': 'Point',
                    'coordinates': [
                        0.0,
                        0.0
                    ]
                }
            }
        }
    });

    return Objects;
});