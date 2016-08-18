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
goog.require('ol.style.Text');
goog.require('ol.style.Style');
goog.require('ol.style.ImageRenderArgs');

var raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var source = new ol.source.Vector({wrapX: false});
var textSource = new ol.source.Vector({wrapX: false});

var vector = new ol.layer.Vector({
  source: source
});

var textLayer = new ol.layer.Vector({
  source: textSource
});

var map = new ol.Map({
  layers: [raster, vector, textLayer],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View({
    center: [425196, 2388189],
    zoom: 4
  })
});

function mapOnClick(event) {
  source.forEachFeature(function (f) {
    f.set("isSelected", false);
  });

  textSource.forEachFeature(function (f) {
    f.set("isSelected", false);
  });

  map.forEachFeatureAtPixel(event.pixel, function (f) {
    f.set("isSelected", true);
  });
}

map.on("click", mapOnClick);

var pointPreRenderFunc = function (context, coordinates, args, feature, pixelRatio) {
  if (!feature.get("isSelected")) {
    return;
  }

  var margin = 5;

  var frameExtent = args.getExtent(coordinates);
  var coord = [frameExtent[0] - margin, frameExtent[3] + margin, frameExtent[2] + margin, frameExtent[1] - margin];

  var pathRenderFunc = buildPathRenderFunction("rgba(143, 143, 143, 0.3)", undefined);
  drawRectangle(context, coord, pathRenderFunc);
};

var pointPostRenderFunc = function (context, coordinates, args, feature, pixelRatio) {
  var cssHelpers = new ol.style.CssHelpers();

  //Compute the extent occupied by the image
  var frameExtent = args.getExtent(coordinates);
  var margin = 6;
  var spaceBetweenIconAndText = 2;

  var minx = frameExtent[0] - margin;
  var miny = frameExtent[1] - margin;
  var maxx = frameExtent[2] + margin;
  var maxy = frameExtent[3] + margin;

  var selectionExtent = [minx, miny, maxx, maxy];

  var xArc = minx - 7;
  var yArc = maxy + spaceBetweenIconAndText;

  var text = feature.get("statusMsg");
  var font = "italic small-caps bold 10px arial";

  context.setLineDash([]);
  var statusColor;
  switch (feature.get("status")) {
    case 0:
      statusColor = "green";
      break;
    case 1:
      statusColor = "orange";
      break;
    default:
      statusColor = "red";
  }

  context.fillStyle = statusColor;
  context.strokeStyle = "white";
  context.font = font;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  var textHeight = cssHelpers.getHeight(font);
  var o = context.measureText(text);
  var xTextMax = minx + o.width;

  var detailTextWidth = xTextMax - xArc;
  var xDetailMin = coordinates[0] - (detailTextWidth / 2);
  var xDetailMax = coordinates[0] + (detailTextWidth / 2);
  context.strokeText(text, xDetailMin + 7, yArc + textHeight);
  context.fillText(text, xDetailMin + 7, yArc + textHeight);

  context.beginPath();
  context.arc(xDetailMin, yArc + (textHeight / 2), 4, 0, 2 * Math.PI);
  context.stroke();
  context.fill();


  if (xArc < selectionExtent[0]) {
    selectionExtent[0] = xDetailMin;
  }

  if (yArc > selectionExtent[3]) {
    selectionExtent[3] = yArc + textHeight + margin;
  }

  if (xTextMax > selectionExtent[2]) {
    selectionExtent[2] = xDetailMax;
  }

  context.beginPath();
  context.moveTo(maxx - 5, miny + 12);
  context.lineTo(maxx + 20, miny - 10);
  context.lineTo(maxx + 30, miny - 10);
  context.strokeStyle = "black";
  context.stroke();
  context.strokeStyle = "white";
  context.font = "normal";
  context.fillStyle = "black";
  var flightId = "Flight " + feature.get("flightId");
  context.strokeText(flightId, maxx + 32, miny - 10);
  context.fillText(flightId, maxx + 32, miny - 10);
  context.fillStyle = "grey";
  var eta = "ETA: " + feature.get("eta");
  context.strokeText(eta, maxx + 32, miny);
  context.fillText(eta, maxx + 32, miny);
};

function pointStyleFunc(feature, resolution) {
  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: feature.get("scale"),
      rotation: Math.PI / 180 * feature.get("course"),
      src: "data/plane.png",
      //Pre-render instructions are executed right before OL3 rendering instructions
      preRender: pointPreRenderFunc,

      //Post-render instructions are executed right after OL3 rendering instructions
      postRender: pointPostRenderFunc
    })
  });

  return iconStyle;
}

vector.setStyle(pointStyleFunc);

var textPreRenderFunc = function (context, coordinates, args, feature, pixelRatio) {
  if (!feature.get("isSelected")) {
    return;
  }

  var textBlockCorners = args.getTextBlockCorners(coordinates, context, 4);

  var func = function (context) {
    context.fillStyle = "rgb(0, 255, 255)";
    context.fill();
  };

  drawPolygon(context, textBlockCorners, func);
};

var textPostRenderFunc = function (context, coordinates, args, feature, pixelRatio) {
  if (!feature.get("isSelected")) {
    return;
  }

  var func = function (context) {
    context.setLineDash([]);
    context.strokeStyle = "#000000";
    context.lineWidth = 2;
    context.stroke();

    context.setLineDash([5]);
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 2;
    context.stroke();
  };

  var textBlockCorners = args.getTextBlockCorners(coordinates, context, 4);
  drawPolygon(context, textBlockCorners, func);
};

function textStyleFunc(feature, resolution) {
  var styleOptions = {
    font: feature.get("font"),
    scale: feature.get("scale"),
    rotation: Math.PI / 180 * feature.get("rotation"),
    text: feature.get("text"),
    fill: new ol.style.Fill({
      color: "black"
    }),
    preRender: textPreRenderFunc,
    postRender: textPostRenderFunc
  };


  if (!feature.get("isSelected")) {
    styleOptions.stroke = new ol.style.Stroke({
      color: "white",
      width: 3
    });
  }

  var style = new ol.style.Style({
    text: new ol.style.Text(styleOptions)
  });
  return style;
}

textLayer.setStyle(textStyleFunc);

var plane = new ol.Feature({
  geometry: new ol.geom.Point([425196, 2388189]),
  course: 43,
  flightId: "AF024",
  eta: "22:14",
  scale: 0.75,
  status: 1,
  statusMsg: "15mn delay"
});
source.addFeature(plane);

plane = new ol.Feature({
  geometry: new ol.geom.Point([1925196, 1088189]),
  course: 300,
  flightId: "GH038",
  eta: "18:32",
  scale: 0.5,
  status: 0,
  statusMsg: "On time"
});
source.addFeature(plane);

plane = new ol.Feature({
  geometry: new ol.geom.Point([3425196, 2088189]),
  course: 340,
  flightId: "BA056",
  eta: "23:36",
  scale: 0.75,
  status: 2,
  statusMsg: "2h delay"
});
source.addFeature(plane);

var text = new ol.Feature({
  geometry: new ol.geom.Point([425196, 1388189]),
  text: "SAMPLE TEXT",
  font: "bold 20px arial",
  scale: 0.75,
  rotation: 15
});
textSource.addFeature(text);

text = new ol.Feature({
  geometry: new ol.geom.Point([3425196, 3088189]),
  text: "A very long example of text, over 100 pixels wide",
  font: "bold 20px arial",
  scale: 0.75,
  rotation: 0
});
textSource.addFeature(text);
