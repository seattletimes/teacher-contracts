//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

//ICH code for popup template if needed----------
var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var xhr = require("./lib/xhr");
var template = require("./lib/dot").compile(require("./_tooltip.html"));

var change = window.change;
var featureLookup = {};

var scale = [
  { limit: .2, color: "#FFE353" },
  { limit: .4, color: "#EDB646" },
  { limit: .6, color: "#D38C40" },
  { limit: .8, color: "#B1673B" },
  { limit: 1.0, color: "#8A4734" }
];

xhr("./assets/schools.geo.json", function(err, data) {
	var fillKey = function() {
	};
	fillKey();
	var paintChange = function(feature) {
    // var GEOID = [feature.properties.GEOID];
    // var fillColor = "transparent";
    // var max = getMaxSold();
};
  
  var paint = function(feature) {
    var GEOID = [feature.properties.GEOID];
    var fillColor = scale[change];
    if (GEOID && typeof GEOID.value == "number") {
      for (var i = 0; i < scale.length; i++) {
        var pigment = scale[i];
        if (GEOID.value <= pigment.limit) {
          fillColor = pigment.color;
          break;
        }
      }
    }
    return {
      fillColor,
      weight: 1,
      color: "rgba(0, 0, 0, .8)",
      fillOpacity: .7
    }
  };
	var onClick = function(e) {
		map.openPopup(template(data), e.latlng)
  };

  console.log(change);
	var schools = L.geoJson(data, {
    style: paint,
    onEachFeature: function(feature, layer) {
      layer.on("click", onClick.bind(feature.properties));
    }
  });

	var onEachFeature = function(feature, layer) {
  	layer.bindPopup(ich.popup(feature.properties))
	};

  schools.addTo(map);
  map.fitBounds(schools.getBounds());

  });
 map.scrollWheelZoom.disable();