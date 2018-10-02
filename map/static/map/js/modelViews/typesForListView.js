define(["marionette"], function (Marionette) {
    var TypesForListView = Marionette.View.extend({
        template: _.template('<%= name %>'),
        tagName: 'option',
        attributes: {
            value: function () {
                return TypesForListView.arguments[0].model.get('id')
            },
            selected: function () {
                return TypesForListView.arguments[0].model.get('selected')
            }
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'add', this.render);
        }
    });

    return TypesForListView;
});