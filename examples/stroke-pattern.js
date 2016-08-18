goog.require('ol.Feature');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Polygon');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');
goog.require('ol.source.OSM');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');

var raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var source = new ol.source.Vector({wrapX: false});

var vector = new ol.layer.Vector({
  source: source
});

var map = new ol.Map({
  layers: [raster, vector],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View({
    center: [-1602120, 1359967],
    zoom: 4
  })
});

function createRailroadPattern() {
  var offset = 10;
  var size = offset;
  var y = size / 2;
  var halfOffset = offset / 2;
  var y1 = y - halfOffset;
  var y2 = y + halfOffset;
  var i;

  var canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1.5;
  ctx.moveTo(0, y);
  ctx.lineTo(size, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.moveTo(halfOffset, y1);
  ctx.lineTo(halfOffset, y2);
  ctx.stroke();

  return canvas;
}

function getPatternCanvas_RedTriangle() {
  var width = 10;
  var height = 10;

  //Prepare canvas
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");

  //Draw pattern
  ctx.moveTo(0, height);
  ctx.lineTo(width * 0.5, 0);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  return canvas;
};

var styleRailroad = new ol.style.Style({
  stroke: new ol.style.Stroke({
    strokePattern: {
      pattern: createRailroadPattern(),
      checksum: "railroad" //Checksum is a unique value associated to the pattern. Checksum must be modified whenever
      //pattern definition changes.
    }
  })
});

var feature = new ol.Feature({
  geometry: new ol.geom.LineString([
    [-1777619, 2048512],
    [-1555035, 1929882],
    [-1421728, 1991031],
    [-1268854, 1876070],
    [-1134325, 1847941],
    [-1067060, 1884631],
    [-908071, 1832042]
  ]),
  name: "Railroad"
});
feature.setStyle(styleRailroad);

source.addFeature(feature);

var style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255,0,0,0.3)"
  }),
  stroke: new ol.style.Stroke({
    strokePattern: {
      pattern: getPatternCanvas_RedTriangle(),
      checksum: "red-triangle"
    }
  })
});

feature = new ol.Feature({
  geometry: new ol.geom.Polygon([
    [[-1000000, -50000], [-500000, -500000], [0, -500000], [1000000, -50000], [0, 1000000]],
    [[-200000, -200000], [-200000, 200000], [200000, 200000], [200000, -200000]]
  ]),
  name: "Polygon1"
});
feature.setStyle(style);

source.addFeature(feature);
