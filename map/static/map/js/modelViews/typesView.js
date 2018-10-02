define(["marionette",
    "tpl!templates/type-template.tpl",
    "tpl!templates/clicked-type-template.tpl",
    ],
    function (Marionette,
              TypeTpl,
              ClickedTypeTpl
    ) {
    var TypesView = Marionette.View.extend({
        clicked: false,
        // template: _.template($("#type-template").html()),
        template: TypeTpl,
        className: "d-inline-block type-filter",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'add', this.render);
        },
        triggers: {
            click: 'click:filter'
        },
        events: {
            click: 'setClicked'
        },
        getTemplate: function () {
            if (this.clicked) {
                // return _.template($("#cliked-type-template").html());
                return ClickedTypeTpl;
            } else {
                // return _.template($("#type-template").html());
                return TypeTpl;
            }
        },
        setClicked() {
            this.clicked = !this.clicked;
            this.render()
        }
    });

    return TypesView;
});