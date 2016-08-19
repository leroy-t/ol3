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
goog.require('ol.style.CustomRendering');
goog.require('ol.style.CssHelpers');

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
  var n = 0;
  map.forEachFeatureAtPixel(event.pixel, function (f) {
    n++;
  });

  var status = "None";
  if (n > 0) {
    status = "Callout selected";
  }

  document.getElementById("selection").innerText = status;
}

map.on("click", mapOnClick);

var postItHitDetectionFunc = function(context, flatCoordinates, args, feature, pixelRatio) {
  var offsetX = feature.get("offsetX") * pixelRatio;
  var offsetY = feature.get("offsetY") * pixelRatio;
  var content = feature.get("content");

  var style = feature.get("style");

  var frameCenterX = flatCoordinates[0] + offsetX;
  var frameCenterY = flatCoordinates[1] + offsetY;

  var font = style.font ? style.font : "";

  if (context.font !== font) {
    context.font = font;
  }

  var cssHelpers = new ol.style.CssHelpers();
  var height = cssHelpers.getHeight(font) * pixelRatio + 10;
  var width = context.measureText(content).width * pixelRatio + 10;
  context.lineWidth = typeof style.strokeWidth === "number" ? style.strokeWidth : 1;
  context.setLineDash(style.strokeDash ? style.strokeDash : []);
  context.strokeStyle = "black";
  context.fillStyle = "black";

  //Draw line
  context.beginPath();
  context.moveTo(frameCenterX, frameCenterY);
  context.lineTo(flatCoordinates[0], flatCoordinates[1]);
  context.stroke();

  //Draw frame
  context.rect(
    frameCenterX - width / 2,
    frameCenterY - height / 2,
    width ,
    height);
  context.fill();


  if (pixelRatio !== 1) {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
};

var postItRenderFunc = function(context, flatCoordinates, args, feature, pixelRatio) {
  var offsetX = feature.get("offsetX") * pixelRatio;
  var offsetY = feature.get("offsetY") * pixelRatio;
  var content = feature.get("content");

  var style = feature.get("style");

  var frameCenterX = flatCoordinates[0] + offsetX;
  var frameCenterY = flatCoordinates[1] + offsetY;

  var font = style.font ? style.font : "";

  if (context.font !== font) {
    context.font = font;
  }

  if (!style.textAlign) {
    context.textAlign = "left";
  } else if (context.textAlign !== style.textAlign) {
    context.textAlign = style.textAlign;
  }

  var cssHelpers = new ol.style.CssHelpers();
  var height = cssHelpers.getHeight(font) * pixelRatio + 10;
  var width = context.measureText(content).width * pixelRatio + 10;

  context.lineWidth = typeof style.strokeWidth === "number" ? style.strokeWidth : 1;
  context.setLineDash(style.strokeDash ? style.strokeDash : []);
  context.strokeStyle = style.stroke ? style.stroke : "black";

  //Draw line
  context.beginPath();
  context.moveTo(frameCenterX, frameCenterY);
  context.lineTo(flatCoordinates[0], flatCoordinates[1]);
  context.stroke();

  //Draw frame
  context.beginPath();
  drawRoundedRectangle(context, pixelRatio,
    frameCenterX - width / 2, frameCenterY - height / 2,
    width, height, 10, true);
  context.closePath();

  context.fillStyle = style.fill;
  context.fill();
  context.stroke();

  //Draw text
  var x = frameCenterX - width / 2 + 5;
  var y = frameCenterY + height / 2 - 5;

  if (pixelRatio !== 1) {
    var transform = [];
    ol.vec.Mat4.makeTransform2D(transform, x, y, pixelRatio, pixelRatio, 0, -x, -y);
    context.setTransform(
      this._getMatrixElement(transform, 0, 0),
      this._getMatrixElement(transform, 1, 0),
      this._getMatrixElement(transform, 0, 1),
      this._getMatrixElement(transform, 1, 1),
      this._getMatrixElement(transform, 0, 3),
      this._getMatrixElement(transform, 1, 3));
  }

  context.fillStyle = style.fontColor;
  context.textBaseline = "bottom";
  context.fillText(content, x, y);

  if (pixelRatio !== 1) {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
};

var postItExtentFunc = function(context, flatCoordinates, args, feature, pixelRatio) {
  var offsetX = feature.get("offsetX") * pixelRatio;
  var offsetY = feature.get("offsetY") * pixelRatio;
  var content = feature.get("content");

  var style = feature.get("style");

  var frameCenterX = flatCoordinates[0] + offsetX;
  var frameCenterY = flatCoordinates[1] + offsetY;

  var font = style.font ? style.font : "";

  if (context.font !== font) {
    context.font = font;
  }

  var cssHelpers = new ol.style.CssHelpers();
  var height = cssHelpers.getHeight(font) * pixelRatio + 10;
  var width = context.measureText(content).width * pixelRatio + 10;

  //Initialize extent with anchor point
  var extent = [
    flatCoordinates[0], flatCoordinates[1],
    flatCoordinates[0], flatCoordinates[1]
  ];

  //Include frame in extent
  var frameMinX = frameCenterX - width / 2;
  var frameMaxX = frameMinX + width;

  var frameMinY = frameCenterY - height / 2;
  var frameMaxY = frameMinY + height;

  if (extent[0] > frameMinX) {
    extent[0] = frameMinX;
  }

  if (extent[1] > frameMinY) {
    extent[1] = frameMinY;
  }

  if (extent[2] < frameMaxX) {
    extent[2] = frameMaxX;
  }

  if (extent[3] < frameMaxY) {
    extent[3] = frameMaxY;
  }

  return extent;
};

var postItFeature = new ol.Feature({
  geometry: new ol.geom.Point([0, 0]),
  name: "Post-it",
  content: "Post-it custom text",
  style: {
    font: "20px arial",
    fontColor: "black",
    fill: "#00ffff",
    stroke: "blue",
    strokeDash: [],
    strokeWidth: 1
  },
  offsetX: 100,
  offsetY: 50
});

var postItStyle = new ol.style.Style({
  customRendering: new ol.style.CustomRendering({
    //Render is the function reponsible of the actual drawing of the item.
    render: postItRenderFunc,

    //HitDetection defines the rendering used for fine-grain hit detection. It is advised to use simplest rendering
    //version possible for performances consideration. In the call-out example, only the line and frame are drawn, with
    //a single color. Text is not rendered.
    hitDetection: postItHitDetectionFunc,

    //For the new hit-detection implementation, it is mandatory to provide the extent in pixels occupied by the feature.
    extentFunction: postItExtentFunc
  })
});

postItFeature.setStyle(postItStyle);

source.addFeature(postItFeature);
