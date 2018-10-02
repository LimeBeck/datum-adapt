define(["marionette", "ol", "tpl!templates/map-view-template.tpl"], function (Marionette, ol, mapViewTpl) {
    var MapView = Marionette.View.extend({
        // template: _.template($("#map-view-template").html()),
        template: mapViewTpl,
        className: "fullScreen",
        addmap() {
            // Add map
            console.log("Render MapView");

            window.view = new ol.View({
                center: ol.proj.fromLonLat([39.710701, 47.240085]),
                zoom: 17
            });
            window.map = new ol.Map({
                target: 'map',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM({crossOrigin: 'anonymous'})
                    })
                ],
                view: window.view
            });
            window.markersSource = new ol.source.Vector({});

            // Make layer with markers and add it to the map
            var markersLayer = new ol.layer.Vector({
                source: window.markersSource
            });

            window.map.addLayer(markersLayer);

            // Listen to moving map (cos openlayers dont have zoom event) and decide to hide markers
            window.map.on(
                'moveend', function () {
                    // console.log("Zoom:" + window.view.getZoom())
                    if (window.view.getZoom() < 15) {
                        markersLayer.setVisible(false)
                    }
                    else {
                        markersLayer.setVisible(true)
                    }
                }
            );

            // Make different layer for new point
            window.newPointSource = new ol.source.Vector({});

            var newPointLayer = new ol.layer.Vector({
                source: window.newPointSource
            });

            window.map.addLayer(newPointLayer);

            // Add new point on map by click and write it coords in form
            window.map.on("click", function (e) {
                var latlon = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
                $("#add-point-lat").val(latlon[0]);
                $("#add-point-lon").val(latlon[1]);
                $("#change-point-lat").val(latlon[0]);
                $("#change-point-lon").val(latlon[1]);
                var newPoint = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(latlon))
                });
                newPoint.setStyle(new ol.style.Style({
                    image: new ol.style.Icon(({
                        crossOrigin: 'anonymous',
                        src: 'static/map/css/images/hospital.png',
                        size: [128, 128],
                        scale: 0.4,
                        anchor: [0.5, 1]
                    }))
                }));
                window.newPointSource.clear();
                window.newPointSource.addFeature(newPoint);
            });
        }
    });

    return MapView;
});