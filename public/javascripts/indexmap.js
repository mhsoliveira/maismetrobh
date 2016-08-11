$(document).ready(function() {

  $("#media").click(function(){
    $(".social").toggle();
  });

    var MyCustomMarker = new L.Icon({
            shadowUrl: null,
            iconAnchor: new L.Point(23, 18),
            iconSize: new L.Point(26, 24),
            iconUrl: '../images/Metro_Logo.png'
    });

    $.getJSON('/all', function(data) {
      for  (i = 0; i < data.length; i++) {
        plotMap(data[i])
        rate(data[i])
      };
    }).then(function() {
        var monkeyList = new List("test-list", {
          valueNames: ['refs1','refs2','refs3'],
          page: 2,
          plugins: [ ListPagination({}) ]
        });
    });

    function rate(item) {
      var idrating = '#'+item._id+'m';

      if (item.rating.length>1) {
        var sum = item.rating.reduce(function(a, b) { return a + b; });
        var avg = sum / item.rating.length;
      }
      else {
        avg = item.rating[0];
      }
      myrating(idrating, avg)

      function myrating(id, rate) {
        $(id).rateYo({
            rating: rate,
            starWidth: "16px",
            normalFill: "transparent",
            ratedFill: "#EC6655",
            readOnly: true
          });
      };
    };

    function plotMap(item) {
        if (item.coordinates.length%2===0){var idx=item.coordinates.length/2-1;}
        else{var idx=(item.coordinates.length-1)/2;}
        var map = L.map(document.getElementById(item._id)).setView([item.coordinates[idx][1],item.coordinates[idx][0]], 11);
        L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'})
        .addTo(map);


        addLayer(item);
        addPoints(item);

      function addLayer(layer) {
        var leaf_layer;
        var myStyle = {
            "color":  "#ec6655",
            "weight": 5,
            "opacity": 1
        };
        leaf_layer = L.geoJson(layer, {
             style: myStyle
        });
        leaf_layer.addTo(map);
        };


      function addPoints(layer) {
        var leaf_layer;
        layer.type = "MultiPoint";
        leaf_layer = L.geoJson(layer, {
          pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: MyCustomMarker});
            }
        });
        leaf_layer.addTo(map);
        };
    };
  });
