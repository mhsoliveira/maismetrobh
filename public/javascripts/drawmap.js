var newDes = {
type: String,
coordinates: [],
};

$(document).ready(function() {

    var MyCustomMarker = L.Icon.extend({
      options: {
          shadowUrl: null,
          iconAnchor: new L.Point(12, 12),
          iconSize: new L.Point(24, 24),
          iconUrl: '../images/Metro_Logo.png'
      }
    });


    var map = L.map("map").setView([-19.9129,-43.9409], 13);
    L.tileLayer('http://b.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'}).addTo(map);
    var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);


    L.drawLocal.draw.handlers.polyline.error = '<strong>Erro:</strong> Não cruze ou sobreponha trajetos na sua proposta';
    L.drawLocal.draw.toolbar.buttons.polyline = 'Clique aqui para começar o seu desenho';
    L.drawLocal.draw.toolbar.undo.text = 'Volte ao último ponto';
    L.drawLocal.draw.toolbar.actions.text = 'Cancelar';
    L.drawLocal.draw.handlers.polyline.tooltip = {
    start: 'Clique em algum ponto para começar a desenhar',
    cont: 'Continue o desenho ou clique sobre o ultimo ponto para finalizar',
    end: 'Clique sobre o último ponto para finalizar o desenho'
    };

    L.drawLocal.edit = {
    toolbar:{
      actions:{
        save:{
          text:'Salvar edição'
        },
        cancel:{
          text:'Cancelar Edição'
        }
      },
      buttons:{
        edit: "Clique aqui para editar sua proposta",
        editDisabled: '',
    		remove: 'Apague a sua proposta',
        removeDisabled: ''
      }
    }

    }

      var drawControl = new L.Control.Draw({
          draw:{
            polyline: {
            //  icon: new MyCustomMarker(),
              allowIntersection: true,
              shapeOptions: {
                color: '#1ab9d8',
                opacity: 1
              },
              drawError: {
                color: 'orange',
                timeout: 2000
              }
            },
            polygon: false,
            rectangle: false,
            circle: false,
            marker: false
          },
          edit: {
              featureGroup: drawnItems
            }
      });
      map.addControl(drawControl);

      map.on('draw:drawstart', function () {
        $(".bubble").hide();
      });

      map.on("draw:deleted", function (e) {
        drawControl.setDrawingOptions({
        polyline:true
        });
        map.removeControl(drawControl);
        map.addControl(drawControl);
      });

      map.on('draw:created', function (e) {
          var type = e.layerType,
              layer = e.layer,
              arr = [];


          for (var j = 0; j < layer._latlngs.length; j++ ) {
            arr.push([layer._latlngs[j].lng,layer._latlngs[j].lat]);
          };


          newDes.type = type;
          newDes.coordinates = arr;
          drawnItems.addLayer(layer);
          drawControl.setDrawingOptions({
            polyline:false
          });
          map.removeControl(drawControl);
          map.addControl(drawControl);
      });
});
