var map = L.map("map").setView([-19.9129,-43.9409], 12);
L.tileLayer('http://b.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
var admap;

function getColor(d) {
    return d > 50 ? '#800026' :
           d > 30  ? '#BD0026' :
           d > 20  ? '#E31A1C' :
           d > 15  ? '#FC4E2A' :
           d > 10   ? '#FD8D3C' :
           d > 5   ? '#FEB24C' :
           d > 1   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.sumcount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    admap.resetStyle(e.target);
}

function zoomToFeature(e) {
    $.getJSON('/rmbhmap/'+e.target.feature.properties.NOM_UP, function(docs) {
      addLayer(docs)
    });
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

$.getJSON('/rmbh', function(data) {
  admap = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
});
  console.log(admap)
  admap.addTo(map);
});

function addLayer(layer) {
  var leaf_layer;
  var myStyle = {
      "color": '#1ab9d8',
      "weight": 5,
      "opacity": 1
  };
  leaf_layer = L.geoJson(layer, {
       style: myStyle
  });
  leaf_layer.addTo(map);
  };

  var MyCustomMarker = new L.Icon({
          shadowUrl: null,
          iconAnchor: new L.Point(11, 12),
          iconSize: new L.Point(20, 20),
          iconUrl: '../images/Metro_Logo.png'
  });
