//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var xhr = require("./lib/xhr");
var template = require("./lib/dot").compile(require("./_tooltip.html"));

var allData = window.allData;
var featureLookup = {};

xhr("./assets/schools.geo.json", function(err, data) {
	var fillKey = function() {
	};
	fillKey();

  var findDistrictData = function(geoid) {
    var districtData = allData.find(function(individualChange) {
      return individualChange.GEOID == geoid;
    });

    return districtData;
  }
  
  var paint = function(feature) {
    var fillColor = "transparent";

    // GEOID == identifier for the disrict
    var districtData = findDistrictData(feature.properties.GEOID);

    if (districtData) {
      // District data will either be a number or undefined - if a number use it to color
      var min = Number.parseFloat(districtData.pChangeMax);

      if (!isNaN(min)) {
        fillColor = min <= .05 ? '#F9EF55' :
                    min <= .1 ? '#FFBA40' :
                    min <= .15 ? '#F78B43' :
                    min <= .2 ? '#D33A55' :
                    '#AB1D34';
      }
    }

    return {
      fillColor,
      weight: 1,
      color: "rgba(0, 0, 0, .3)",
      fillOpacity: .8
    }
  };

	var onClick = function(e) {
    var districtData = findDistrictData(this.GEOID);
		map.openPopup(template(districtData), e.latlng)
  };

	var schools = L.geoJson(data, {
    style: paint,
    onEachFeature: function(feature, layer) {
      layer.on("click", onClick.bind(feature.properties));
    }
  });

  schools.addTo(map);
  map.fitBounds(schools.getBounds());

  });
 map.scrollWheelZoom.disable();