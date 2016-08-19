goog.require('ol.Feature');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.geom.Point');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');
goog.require('ol.source.OSM');
goog.require('ol.style.Fill');
goog.require('ol.style.Icon');
goog.require('ol.style.Stroke');
goog.require('ol.style.Text');
goog.require('ol.style.Style');
goog.require('ol.style.ReplayArgs');

var raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var textSource = new ol.source.Vector({wrapX: false});

var textLayer = new ol.layer.Vector({
  source: textSource
});

var map = new ol.Map({
  layers: [raster, textLayer],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View({
    center: [425196, 2388189],
    zoom: 4
  })
});

function mapOnClick(event) {
  textSource.forEachFeature(function (f) {
    f.set("isSelected", false);
  });

  map.forEachFeatureAtPixel(event.pixel, function (f) {
    f.set("isSelected", true);
  });
}

map.on("click", mapOnClick);


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
