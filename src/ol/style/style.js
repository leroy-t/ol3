goog.provide('ol.style.Style');
goog.provide('ol.style.defaultGeometryFunction');

goog.require('goog.asserts');
goog.require('ol.geom.Geometry');
goog.require('ol.geom.GeometryType');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Image');
goog.require('ol.style.Stroke');
goog.require('ol.style.CustomRendering');

/**
 * @classdesc
 * Container for vector feature rendering styles. Any changes made to the style
 * or its children through `set*()` methods will not take effect until the
 * feature or layer that uses the style is re-rendered.
 *
 * @constructor
 * @struct
 * @param {olx.style.StyleOptions=} opt_options Style options.
 * @api
 */
ol.style.Style = function(opt_options) {

  var options = opt_options || {};

  /**
   * @private
   * @type {string|ol.geom.Geometry|ol.StyleGeometryFunction}
   */
  this.geometry_ = null;

  /**
   * @private
   * @type {!ol.StyleGeometryFunction}
   */
  this.geometryFunction_ = ol.style.defaultGeometryFunction;

  if (options.geometry !== undefined) {
    this.setGeometry(options.geometry);
  }

  /**
   * @private
   * @type {ol.style.Fill}
   */
  this.fill_ = options.fill !== undefined ? options.fill : null;

  /**
   * @private
   * @type {ol.style.Image}
   */
  this.image_ = options.image !== undefined ? options.image : null;

  /**
   * @private
   * @type {ol.style.Stroke}
   */
  this.stroke_ = options.stroke !== undefined ? options.stroke : null;

  /**
   * @private
   * @type {ol.style.Text}
   */
  this.text_ = options.text !== undefined ? options.text : null;

  /**
   * @private
   * @type {ol.style.CustomRendering}
   */
  this.customRendering_ = options.customRendering !== undefined ? options.customRendering : null;

  /**
   * @private
   * @type {number|undefined}
   */
  this.zIndex_ = options.zIndex;

};


/**
 * Get the geometry to be rendered.
 * @return {string|ol.geom.Geometry|ol.StyleGeometryFunction}
 * Feature property or geometry or function that returns the geometry that will
 * be rendered with this style.
 * @api
 */
ol.style.Style.prototype.getGeometry = function() {
  return this.geometry_;
};


/**
 * Get the function used to generate a geometry for rendering.
 * @return {!ol.StyleGeometryFunction} Function that is called with a feature
 * and returns the geometry to render instead of the feature's geometry.
 * @api
 */
ol.style.Style.prototype.getGeometryFunction = function() {
  return this.geometryFunction_;
};


/**
 * Get the fill style.
 * @return {ol.style.Fill} Fill style.
 * @api
 */
ol.style.Style.prototype.getFill = function() {
  return this.fill_;
};


/**
 * Get the image style.
 * @return {ol.style.Image} Image style.
 * @api
 */
ol.style.Style.prototype.getImage = function() {
  return this.image_;
};


/**
 * Get the stroke style.
 * @return {ol.style.Stroke} Stroke style.
 * @api
 */
ol.style.Style.prototype.getStroke = function() {
  return this.stroke_;
};


/**
 * Get the text style.
 * @return {ol.style.Text} Text style.
 * @api
 */
ol.style.Style.prototype.getText = function() {
  return this.text_;
};


/**
 * Get the custom rendering style.
 * @return {ol.style.CustomRendering} Custom rendering style.
 * @api
 */
ol.style.Style.prototype.getCustomRendering = function() {
  return this.customRendering_;
};


/**
 * Get the z-index for the style.
 * @return {number|undefined} ZIndex.
 * @api
 */
ol.style.Style.prototype.getZIndex = function() {
  return this.zIndex_;
};


/**
 * Set a geometry that is rendered instead of the feature's geometry.
 *
 * @param {string|ol.geom.Geometry|ol.StyleGeometryFunction} geometry
 *     Feature property or geometry or function returning a geometry to render
 *     for this style.
 * @api
 */
ol.style.Style.prototype.setGeometry = function(geometry) {
  if (typeof geometry === 'function') {
    this.geometryFunction_ = geometry;
  } else if (typeof geometry === 'string') {
    this.geometryFunction_ = function(feature) {
      var result = feature.get(geometry);
      if (result) {
        goog.asserts.assertInstanceof(result, ol.geom.Geometry,
            'feature geometry must be an ol.geom.Geometry instance');
      }
      return result;
    };
  } else if (!geometry) {
    this.geometryFunction_ = ol.style.defaultGeometryFunction;
  } else if (geometry !== undefined) {
    goog.asserts.assertInstanceof(geometry, ol.geom.Geometry,
        'geometry must be an ol.geom.Geometry instance');
    this.geometryFunction_ = function() {
      return geometry;
    };
  }
  this.geometry_ = geometry;
};


/**
 * Set the z-index.
 *
 * @param {number|undefined} zIndex ZIndex.
 * @api
 */
ol.style.Style.prototype.setZIndex = function(zIndex) {
  this.zIndex_ = zIndex;
};


/**
 * Convert the provided object into a style function.  Functions passed through
 * unchanged.  Arrays of ol.style.Style or single style objects wrapped in a
 * new style function.
 * @param {ol.StyleFunction|Array.<ol.style.Style>|ol.style.Style} obj
 *     A style function, a single style, or an array of styles.
 * @return {ol.StyleFunction} A style function.
 */
ol.style.createStyleFunction = function(obj) {
  var styleFunction;

  if (typeof obj === 'function') {
    styleFunction = obj;
  } else {
    /**
     * @type {Array.<ol.style.Style>}
     */
    var styles;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      goog.asserts.assertInstanceof(obj, ol.style.Style,
          'obj geometry must be an ol.style.Style instance');
      styles = [obj];
    }
    styleFunction = function() {
      return styles;
    };
  }
  return styleFunction;
};


/**
 * @type {Array.<ol.style.Style>}
 * @private
 */
ol.style.defaultStyle_ = null;


/**
 * @param {ol.Feature|ol.render.Feature} feature Feature.
 * @param {number} resolution Resolution.
 * @return {Array.<ol.style.Style>} Style.
 */
ol.style.defaultStyleFunction = function(feature, resolution) {
  // We don't use an immediately-invoked function
  // and a closure so we don't get an error at script evaluation time in
  // browsers that do not support Canvas. (ol.style.Circle does
  // canvas.getContext('2d') at construction time, which will cause an.error
  // in such browsers.)
  if (!ol.style.defaultStyle_) {
    var fill = new ol.style.Fill({
      color: 'rgba(255,255,255,0.4)'
    });
    var stroke = new ol.style.Stroke({
      color: '#3399CC',
      width: 1.25
    });
    ol.style.defaultStyle_ = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: fill,
          stroke: stroke,
          radius: 5
        }),
        fill: fill,
        stroke: stroke
      })
    ];
  }
  return ol.style.defaultStyle_;
};


/**
 * Default styles for editing features.
 * @return {Object.<ol.geom.GeometryType, Array.<ol.style.Style>>} Styles
 */
ol.style.createDefaultEditingStyles = function() {
  /** @type {Object.<ol.geom.GeometryType, Array.<ol.style.Style>>} */
  var styles = {};
  var white = [255, 255, 255, 1];
  var blue = [0, 153, 255, 1];
  var width = 3;
  styles[ol.geom.GeometryType.POLYGON] = [
    new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.5]
      })
    })
  ];
  styles[ol.geom.GeometryType.MULTI_POLYGON] =
      styles[ol.geom.GeometryType.POLYGON];

  styles[ol.geom.GeometryType.LINE_STRING] = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: white,
        width: width + 2
      })
    }),
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: blue,
        width: width
      })
    })
  ];
  styles[ol.geom.GeometryType.MULTI_LINE_STRING] =
      styles[ol.geom.GeometryType.LINE_STRING];

  styles[ol.geom.GeometryType.CIRCLE] =
      styles[ol.geom.GeometryType.POLYGON].concat(
          styles[ol.geom.GeometryType.LINE_STRING]
      );


  styles[ol.geom.GeometryType.POINT] = [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: width * 2,
        fill: new ol.style.Fill({
          color: blue
        }),
        stroke: new ol.style.Stroke({
          color: white,
          width: width / 2
        })
      }),
      zIndex: Infinity
    })
  ];
  styles[ol.geom.GeometryType.MULTI_POINT] =
      styles[ol.geom.GeometryType.POINT];

  styles[ol.geom.GeometryType.GEOMETRY_COLLECTION] =
      styles[ol.geom.GeometryType.POLYGON].concat(
          styles[ol.geom.GeometryType.LINE_STRING],
          styles[ol.geom.GeometryType.POINT]
      );

  return styles;
};


/**
 * Function that is called with a feature and returns its default geometry.
 * @param {ol.Feature|ol.render.Feature} feature Feature to get the geometry
 *     for.
 * @return {ol.geom.Geometry|ol.render.Feature|undefined} Geometry to render.
 */
ol.style.defaultGeometryFunction = function(feature) {
  goog.asserts.assert(feature, 'feature must not be null');
  return feature.getGeometry();
};

/**
 * Computes the extent (minx, miny, maxx, maxy) from a flat coordinates array.
 * @param {Array<number>} coordinates A flat coordinates array (1-dimension array with all values). Array stride must be 2.
 * @return {Array<number>} The extent (minx, miny, maxx, maxy) of the coordinates array.
 * @api
 */
ol.style.getExtentFromFlatCoordinates = function(coordinates) {
  if (!coordinates) {
    return null;
  }

  var minx = Number.POSITIVE_INFINITY;
  var miny = Number.POSITIVE_INFINITY;
  var maxx = Number.NEGATIVE_INFINITY;
  var maxy = Number.NEGATIVE_INFINITY;

  var x, y;

  for (var i = 0; i < coordinates.length; i += 2) {
    x = coordinates[i];
    y = coordinates[i + 1];

    if (x < minx) {
      minx = x;
    }

    if (x > maxx) {
      maxx = x;
    }

    if (y < miny) {
      miny = y;
    }

    if (y > maxy) {
      maxy = y;
    }
  }

  return [minx, miny, maxx, maxy];
};

/**
 * Computes the flat coordinates array of an extent.
 * @param {Array<number>} extent The extent to convert (minx, miny, maxx, maxy).
 * @return {Array<number>} The flat coordinates array (1-dimension array with all values) representing the extent.
 * Array stride is 2.
 * @api
 */
ol.style.extentToFlatCoordinates = function(extent) {
  var minx = extent[0];
  var miny = extent[1];
  var maxx = extent[2];
  var maxy = extent[3];

  return [minx, miny, maxx, miny, maxx, maxy, minx, maxy]
};

/**
 * Computes the mid-points of every segment from a list.
 * @param {Array<number>} coordinates A flat coordinates array (1-dimension array) representing one or more segments.
 * @param {boolean} isPolygon If true, a mid-point is computed between the last and the first point of the array.
 * @api
 */
ol.style.computeMidpoints = function(coordinates, isPolygon) {

  var x1, x2, y1, y2;

  var result = [];

  //Skip the last point of the array, as it's processed by point n-1.
  for (var i = 0; i < coordinates.length - 2; i += 2) {
    x1 = coordinates[i];
    y1 = coordinates[i + 1];
    x2 = coordinates[i + 2];
    y2 = coordinates[i + 3];

    result.push(Math.floor(x1 +(x2 - x1) / 2));
    result.push(Math.floor(y1 + (y2 - y1) / 2));
  }

  if (isPolygon) {
    //Compute mid-point between last and first point
    x1 = coordinates[coordinates.length - 2];
    y1 = coordinates[coordinates.length - 1];
    x2 = coordinates[0];
    y2 = coordinates[1];

    result.push(Math.floor(x1 + (x2 - x1) / 2));
    result.push(Math.floor(y1 + (y2 - y1) / 2));
  }

  return result;
};
