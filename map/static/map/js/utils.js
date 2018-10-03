define(["backbone", "ol", "jquery"], function (Backbone, ol, $) {
    var utils = {};
    utils.setToken = function () {
        $(document).ajaxSend(function (event, request) {
            var token = "Token 695672c4e9320d30f7714b35b069b8857b6bd63c";
            if (token) {
                request.setRequestHeader("Authorization", token);
            }
        });
    };

    utils.setSlashes = function () {
        var _sync = Backbone.sync;
        Backbone.sync = function (method, model, options) {
            // Add trailing slash to backbone model views
            var parts = _.result(model, 'url').split('?'),
                _url = parts[0],
                params = parts[1];

            _url += _url.charAt(_url.length - 1) == '/' ? '' : '/';

            if (!_.isUndefined(params)) {
                _url += '?' + params;
            }

            options = _.extend(options, {
                url: _url
            });

            return _sync(method, model, options);
        };
    };


    utils.styles = {
        0: new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: 'static/map/css/images/location-pin (1).png',
                size: [64, 64],
                scale: 0.6
            }))
        }),
        1: new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: 'static/map/css/images/icons8-park-bench-filled-50.png',
                size: [50, 50],
                scale: 0.7
            }))
        }),
        2: new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: 'static/map/css/images/icons8-monument-filled-50.png',
                scale: 0.7
            }))
        }),
        3: new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: 'static/map/css/images/icons8-library-filled-50.png',
                scale: 0.7
            }))
        }),
        4: new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: 'static/map/css/images/icons8-barbell-filled-50.png',
                scale: 0.7
            }))
        })
    };

    return utils;
});
