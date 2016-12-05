var map = L.map("map").setView([-19.9129,-43.9409], 13);


$.getJSON('/ideasfind2/'+ideaId, function(data) {
  L.tileLayer('http://b.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  addLayer(data);
  addPoints(data);
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


  function addPoints(layer) {
    var leaf_layer;
    layer.type = "MultiPoint";
    leaf_layer = L.geoJson(layer, {
      pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: MyCustomMarker});
        }
    });
    leaf_layer.addTo(map);
    map.fitBounds(leaf_layer.getBounds());
    };
