goog.require('ol.Feature');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');
goog.require('ol.source.OSM');
goog.require('ol.style.Fill');
goog.require('ol.style.Icon');
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
    center: [0, 0],
    zoom: 4
  })
});

function mapOnClick(event) {
  source.forEachFeature(function (f) {
    f.set("isSelected", false);
  });

  map.forEachFeatureAtPixel(event.pixel, function (f) {
    f.set("isSelected", true);
  });
}

map.on("click", mapOnClick);

function createDiagPattern() {
  var n = 0;
  var offset = 4;
  var size = Math.sqrt(offset * offset) * 3;
  var i;

  var canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  ctx.beginPath();
  while (n <= size * 2) {
    i = Math.sqrt(n * n);
    ctx.moveTo(0, i);
    ctx.lineTo(i, 0);
    n += offset;
  }

  ctx.stroke();

  return canvas;
}

var highlightOuterVerticesPolygonRenderFunc = function (context, coordinates, args, feature, pixelRatio) {

  var isSelected = feature.get("isSelected");

  if (!isSelected) {
    return;
  }

  var angle = 2 * Math.PI;
  var radius = 5;

  context.fillStyle = "green";
  context.strokeStyle = "green";
  context.lineWidth = 1;

  var hullCoords = args.getHullCoordinates(coordinates, 0);

  for (var d = 0; d < hullCoords.length; d += 2) {
    context.beginPath();
    context.arc(hullCoords[d], hullCoords[d + 1], radius, 0, angle);
    context.fill();
    context.stroke();
  }
};

var highlightVerticesPolygonRenderFunc = function (context, coordinates, args, feature, pixelRatio) {

  var isSelected = feature.get("isSelected");

  if (!isSelected) {
    return;
  }

  var side = 6;
  var halfSide = side / 2;

  context.fillStyle = "white";
  context.strokeStyle = "black";

  var hullCoords;

  for (var i = 0; i < args.getHullCount(); i++) {
    hullCoords = args.getHullCoordinates(coordinates, i);

    for (var d = 0; d < hullCoords.length; d += 2) {
      context.beginPath();
      context.rect(hullCoords[d] - halfSide, hullCoords[d + 1] - halfSide, side, side);
      context.fill();
      context.stroke();
    }
  }
};

var diagPattern = createDiagPattern();
var patternToFillRenderFunc = function (context, coordinates, args, feature, pixelRatio) {

  var isSelected = feature.get("isSelected");

  if (!isSelected) {
    return;
  }

  var pattern = context.createPattern(diagPattern, "repeat");

  args.setPath(context, coordinates);

  context.fillStyle = pattern;
  context.fill();
};

var highlightSidesPolygonRenderFunc = function (context, coordinates, args, feature, pixelRatio) {

  var isSelected = feature.get("isSelected");

  if (!isSelected) {
    return;
  }

  context.lineWidth = 3;
  context.strokeStyle = "black";

  var hullCoords = args.getHullCoordinates(coordinates, 0);

  args.setPath(context, hullCoords);

  context.stroke();
};

var polygonStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "red",
    preRender: highlightSidesPolygonRenderFunc,
    postRender: patternToFillRenderFunc
  }),
  stroke: new ol.style.Stroke({
    color: "blue",
    width: 1,
    preRender: highlightOuterVerticesPolygonRenderFunc,
    postRender: highlightVerticesPolygonRenderFunc
  })
});

vector.setStyle(polygonStyle);

var polygon = new ol.Feature({
  geometry: new ol.geom.Polygon([
    [[-1000000, -50000], [-500000, -500000], [0, -500000], [1000000, -50000], [0, 1000000]],
    [[-200000, -200000], [-200000, 200000], [200000, 200000], [200000, -200000]]
  ]),
  name: "Polygon1"
});
source.addFeature(polygon);

polygon = new ol.Feature({
  geometry: new ol.geom.Polygon([
    [[0, -50000], [500000, -500000], [1000000, -500000], [2000000, -50000], [1000000, 1000000]],
    [[800000, -200000], [800000, 200000], [1200000, 200000], [1200000, -200000]]
  ]),
  name: "Polygon2"
});
source.addFeature(polygon);
