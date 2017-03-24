var map = L.map("map").setView([-19.9129,-43.9409], 13);
L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
var admap;
var layer_line;

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
if (typeof layer_line == "undefined") {
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
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
    admap.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    $.getJSON('/rmbhmap/'+e.target.feature.properties.NOM_UP, function(docs) {
      if (typeof layer_line != "undefined") {
        map.removeLayer(layer_line)
      }
      var acc2=[];
      docs.reduce(function(acc, val) {
        acc2.push(L.geoJson(val).bindPopup('<img class="avatar2 col-xs-2" src='+val.user.picture+'><div class="col-xs-10"><b>'+val.user.username+'</b><button onclick=window.location="/ideas/'+val._id+'" type="button" class="btn-xs btn btn-success">Ir para a proposta</button></div>'));
      },0)
      layer_line = L.layerGroup(acc2)
      layer_line.addTo(map);
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
  admap.addTo(map);
  map.fitBounds(admap.getBounds())
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
  layer_line = leaf_layer;
  };

  var MyCustomMarker = new L.Icon({
          shadowUrl: null,
          iconAnchor: new L.Point(11, 12),
          iconSize: new L.Point(20, 20),
          iconUrl: '../images/Metro_Logo.png'
  });

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Propostas por região</h4>' +  (props ?
            '<b>' + props.NOM_UP + '</b><br />' + props.sumcount + ' Linhas de metrô'
            : 'Passe por cima das regiões para ver o número de propostas submetidas');
    };

    info.addTo(map);

    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 5, 10, 15, 20, 30, 50],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
