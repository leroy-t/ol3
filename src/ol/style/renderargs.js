goog.provide('ol.style.ReplayArgs');
goog.provide('ol.style.ImageRenderArgs');
goog.provide('ol.style.FillRenderArgs');
goog.provide('ol.style.StrokeRenderArgs');
goog.provide('ol.style.TextRenderArgs');

goog.require('ol.style.CssHelpers');

/**
 * @classdesc
 * Argument of a ol.style.CustomRenderFunction.
 *
 * @constructor
 * @param {number} tolerance The tolerance for geometry simplification.
 * @param {ol.Extent} maximumExtent The maximum extent.
 * @param {number} resolution The current resolution of the viewport.
 * @param {ol.proj.Projection} projection The current projection of the viewport.
 * @param {number=} pixelRatio The pixel ratio of the viewport.
 * @param {number=} viewRotation The rotation angle of the viewport.
 * @api
 */
ol.style.ReplayArgs = function(tolerance, maximumExtent, resolution, projection,
  pixelRatio, viewRotation) {
  if (typeof pixelRatio !== "number") {
    pixelRatio = 1;
  }
  if (typeof viewRotation !== "number") {
    viewRotation = 0;
  }

  this.tolerance = tolerance;
  this.maxExtent = maximumExtent;
  this.resolution = resolution;
  this.projection = projection;
  this.pixelRatio = pixelRatio;
  this.viewRotation = viewRotation;
};

//region ImageRenderArgs
/**
 * @classdesc
 * Argument of a ol.style.PointRenderFunction.
 *
 * @constructor
 * @param {number} tolerance The tolerance for geometry simplification.
 * @param {ol.Extent} maximumExtent The maximum extent.
 * @param {number} resolution The current resolution of the viewport.
 * @param {ol.proj.Projection} projection The current projection of the viewport.
 * @param {Array<number>} anchorOffset The coordinates of the anchor point, relative to the top left corner of
 * the image.
 * @param {Array<number>} origin The top-left point of the zone of the image to draw. If the full image is to be drawn,
 * origin is [0,0] and size is the size of the image.
 * @param {Array<number>} size The size of the zone of the image to paint.
 * @param {number} opacity The opacity.
 * @param {number} scale The scale of the image.
 * @param {number} rotation The angle of rotation of the image.
 * @param {boolean} rotateWithView true if the image should rotate with the view; false if it should remain upward.
 * @param {boolean} snapToPixel true if the coordinates should be kept to integer values; false if they can be float.
 * @extends {ol.style.ReplayArgs}
 * @api
 */
ol.style.ImageRenderArgs = function(tolerance, maximumExtent, resolution, projection,
                                    anchorOffset, origin, size, opacity, scale, rotation,
                                    rotateWithView, snapToPixel) {

  ol.style.ReplayArgs.call(this, tolerance, maximumExtent, resolution, projection);

  this.anchorOffset = anchorOffset;
  this.origin = origin;
  this.size = size;
  this.opacity = opacity;
  this.scale = scale;
  this.rotation = rotation;
  this.rotateWithView = rotateWithView;
  this.snapToPixel = snapToPixel;
};
goog.inherits(ol.style.ImageRenderArgs, ol.style.ReplayArgs);

/**
 *
 * @param {Array<number>} extent The extent of the zone of the image to draw, without scale or rotation modifications.
 * @param {Array<number>} centerCoordinates The reference point for positioning the image.
 * @returns {Array<number>} The projected extent, taking into account the scale and the rotation of the image.
 * @private
 */
ol.style.ImageRenderArgs.prototype.projectExtent_ = function(extent, centerCoordinates) {
  var rotation = this.rotation;

  if (this.rotateWithView) {
    rotation += this.viewRotation;
  }

  var localTransform = goog.vec.Mat4.createNumber();
  ol.vec.Mat4.makeTransform2D(
    localTransform, centerCoordinates[0], centerCoordinates[1], this.scale, this.scale,
    rotation, -centerCoordinates[0], -centerCoordinates[1]);

  var topLeftProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[0], extent[1], 0, 1], topLeftProj);

  var topRightProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[2], extent[1], 0, 1], topRightProj);

  var bottomRightProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[2], extent[3], 0, 1], bottomRightProj);

  var bottomLeftProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[0], extent[3], 0, 1], bottomLeftProj);

  var minx = Math.min(topLeftProj[0], topRightProj[0], bottomRightProj[0], bottomLeftProj[0]);
  var maxx = Math.max(topLeftProj[0], topRightProj[0], bottomRightProj[0], bottomLeftProj[0]);
  var miny = Math.min(topLeftProj[1], topRightProj[1], bottomRightProj[1], bottomLeftProj[1]);
  var maxy = Math.max(topLeftProj[1], topRightProj[1], bottomRightProj[1], bottomLeftProj[1]);

  return [minx, miny, maxx, maxy];
};

/**
 *
 * @param coordinates {Array<number>} The coordinates of the reference point.
 * @param margin {number} The margin in pixels added around the image before returning the extent.
 * @returns {Array<number>} The extent of the zone covered by the image (in viewport coordinates), in the
 * [minx, miny, maxx, maxy] format.
 * @api
 */
ol.style.ImageRenderArgs.prototype.getExtent = function (coordinates, margin) {
  if (typeof this.pixelRatio !== "number") {
    this.pixelRatio = 1;
  }

  var zoneWidth = this.size[0] * this.pixelRatio;
  var zoneHeight = this.size[1] * this.pixelRatio;

  var x = coordinates[0] - this.anchorOffset[0];
  var y = coordinates[1] - this.anchorOffset[1];

  if (margin == null) {
    margin = 0;
  }

  var extent = [x - margin, y - margin, x + zoneWidth + margin, y + zoneHeight + margin];

  return this.projectExtent_(extent, coordinates);
};
//endregion

//region FillRenderArgs
/**
 * @classdesc
 * Argument of a ol.style.FillRenderFunction.
 *
 * @constructor
 * @param {number} tolerance The tolerance for geometry simplification.
 * @param {ol.Extent} maximumExtent The maximum extent.
 * @param {number} resolution The current resolution of the viewport.
 * @param {ol.proj.Projection} projection The current projection of the viewport.
 * @param {ol.ColorLike} fillStyle The fill color or the image array of the pattern.
 * @param {boolean} closePath True if the path is a closed shape; false otherwise.
 * @extends {ol.style.ReplayArgs}
 * @api
 */
ol.style.FillRenderArgs = function(tolerance, maximumExtent, resolution, projection, fillStyle, closePath) {

  ol.style.ReplayArgs.call(this, tolerance, maximumExtent, resolution, projection);

  this.fillStyle = fillStyle;
  this.closePath = closePath;
};
goog.inherits(ol.style.FillRenderArgs, ol.style.ReplayArgs);

ol.style.FillRenderArgs.prototype.clone = function() {
  var args =  new ol.style.FillRenderArgs(this.tolerance, this.maxExtent, this.resolution, this.projection,
    this.fillStyle, this.closePath);
  args.pixelRatio = this.pixelRatio;
  args.resolution = this.resolution;
  args.viewRotation = this.viewRotation;

  return args;
};

ol.style.FillRenderArgs.prototype.setEnds = function(ends) {
  var result = null;
  if (ends) {
    result = [];

    //Ends needs to be adjusted as two extra coordinates are added per hull during transform
    for (var i = 0; i < ends.length; i++) {
      result.push(ends[i] + (i + 1) * 2);
    }
  }

  this.ends = result;
};

/**
 * Returns the number of hulls defined in the args.
 * @returns {number} The number of hulls.
 * @api
 */
ol.style.FillRenderArgs.prototype.getHullCount = function() {
  return this.ends ? this.ends.length : 0;
};

/**
 *
 * @param {Array<number>} coordinates A flat coordinates array representing all hulls of a polygon.
 * @param {number} index The index of the hull to extract.
 * @returns {Array<number>} The flat coordinates of the hull.
 * @api
 */
ol.style.FillRenderArgs.prototype.getHullCoordinates = function(coordinates, index) {
  if (!coordinates) {
    throw new Error("Coordinates cannot be null.");
  }

  if (index < 0 || index >= this.getHullCount()) {
    throw new Error("Index is out of bounds.");
  }

  var end = this.ends[index];
  var start = index === 0 ? 0 : this.ends[index - 1] + 2;

  return coordinates.slice(start, end);
};

/**
 *
 * @param {CanvasRenderingContext2D} context The 2d canvas context for which the path should be set.
 * @param {Array<number>} coordinates A flat coordinates array representing all hulls of a polygon.
 * @api
 */
ol.style.FillRenderArgs.prototype.setPath = function(context, coordinates) {
  if (!context) {
    throw new Error("Context cannot be null.");
  }

  if (!coordinates) {
    throw new Error("Coordinates cannot be null.");
  }

  var hullCoords;

  context.beginPath();

  for (var i = 0; i < this.getHullCount(); i++) {
    hullCoords = this.getHullCoordinates(coordinates, i);

    for (var d = 0; d < hullCoords.length; d += 2) {
      if (d === 0) {
        context.moveTo(hullCoords[d], hullCoords[d + 1]);
      } else {
        context.lineTo(hullCoords[d], hullCoords[d + 1]);
      }
    }

    context.closePath();
  }
};
//endregion

//region StrokeRenderArgs
/**
 * @classdesc
 * Argument of a ol.style.StrokeRenderFunction.
 *
 * @constructor
 * @param {number} tolerance The tolerance for geometry simplification.
 * @param {ol.Extent} maximumExtent The maximum extent.
 * @param {number} resolution The current resolution of the viewport.
 * @param {ol.proj.Projection} projection The current projection of the viewport.
 * @param {string} color The stroke color.
 * @param {string} lineCap The line cap style.
 * @param {Array<number>} lineDash The dash style definition.
 * @param {string} lineJoin The line join style.
 * @param {number} miterLimit The miter limit.
 * @param {number} width The line width.
 * @param {boolean} closePath True if the path is a closed shape; false otherwise.
 * @extends {ol.style.ReplayArgs}
 * @api
 */
ol.style.StrokeRenderArgs = function(tolerance, maximumExtent, resolution, projection,
                                     color, lineCap, lineDash, lineJoin,
                                     miterLimit, width, closePath) {

  ol.style.ReplayArgs.call(this, tolerance, maximumExtent, resolution, projection);

  this.color = color;
  this.lineCap = lineCap;
  this.lineDash = lineDash;
  this.lineJoin = lineJoin;
  this.miterLimit = miterLimit;
  this.width = width;
  this.closePath = closePath;
};
goog.inherits(ol.style.StrokeRenderArgs, ol.style.ReplayArgs);

ol.style.StrokeRenderArgs.prototype.clone = function() {
  var args =  new ol.style.StrokeRenderArgs(this.tolerance, this.maxExtent, this.resolution, this.projection,
    this.color, this.lineCap, this.lineDash, this.lineJoin, this.miterLimit, this.width, this.closePath);
  args.pixelRatio = this.pixelRatio;
  args.resolution = this.resolution;
  args.viewRotation = this.viewRotation;

  return args;
};

ol.style.StrokeRenderArgs.prototype.setEnds = function(ends) {
  var result = null;
  if (ends) {
    result = [];

    //Ends needs to be adjusted as two extra coordinates are added per hull during transform
    for (var i = 0; i < ends.length; i++) {
      result.push(ends[i] + (i + 1) * 2);
    }
  }

  this.ends = result;
};

/**
 * Returns the number of hulls defined in the args.
 * @returns {number} The number of hulls.
 * @api
 */
ol.style.StrokeRenderArgs.prototype.getHullCount = function() {
  return this.ends ? this.ends.length : 0;
};

/**
 *
 * @param {Array<number>} coordinates A flat coordinates array representing all hulls of a polygon.
 * @param {number} index The index of the hull to extract.
 * @returns {Array<number>} The flat coordinates of the hull.
 * @api
 */
ol.style.StrokeRenderArgs.prototype.getHullCoordinates = function(coordinates, index) {
  if (!coordinates) {
    throw new Error("Coordinates cannot be null.");
  }

  var hullCount = this.getHullCount();

  if (hullCount == 0) {
    return coordinates;
  }

  if (index < 0 || index >= hullCount) {
    throw new Error("Index is out of bounds.");
  }

  var end = this.ends[index];
  var start = index === 0 ? 0 : this.ends[index - 1] + 2;

  return coordinates.slice(start, end);
};

/**
 *
 * @param {CanvasRenderingContext2D} context The 2d canvas context for which the path should be set.
 * @param {Array<number>} coordinates A flat coordinates array representing all hulls of a polygon.
 *
 * @api
 */
ol.style.StrokeRenderArgs.prototype.setPath = function(context, coordinates) {
  if (!context) {
    throw new Error("Context cannot be null.");
  }

  if (!coordinates) {
    throw new Error("Coordinates cannot be null.");
  }

  var hullCoords;

  context.beginPath();

  for (var i = 0; i < this.getHullCount(); i++) {
    hullCoords = this.getHullCoordinates(coordinates, i);

    for (var d = 0; d < hullCoords.length; d += 2) {
      if (d === 0) {
        context.moveTo(hullCoords[d], hullCoords[d + 1]);
      } else {
        context.lineTo(hullCoords[d], hullCoords[d + 1]);
      }
    }

    context.closePath();
  }
};
//endregion

//region TextRenderArgs
/**
 * @classdesc
 * Argument of a ol.style.TextRenderFunction.
 *
 * @constructor
 * @param {number} tolerance The tolerance for geometry simplification.
 * @param {ol.Extent} maximumExtent The maximum extent.
 * @param {number} resolution The current resolution of the viewport.
 * @param {ol.proj.Projection} projection The current projection of the viewport.
 * @param {string} font Font style as CSS 'font' value. Default is '10px sans-serif'.
 * @param {number} offsetX Horizontal text offset in pixels. A positive will shift the text right. Default is 0.
 * @param {number} offsetY Vertical text offset in pixels. A positive will shift the text down. Default is 0.
 * @param {number} scale Scale.
 * @param {number} rotation Rotation in radians (positive rotation clockwise). Default is 0.
 * @param {string} text Text content.
 * @param {string} textAlign Text alignment. Possible values: 'left', 'right', 'center', 'end' or 'start'.
 * @param {string} textBaseline Text base line. Possible values: 'bottom', 'top', 'middle',
 * 'alphabetic', 'hanging', 'ideographic'. Default is 'alphabetic'.
 * @param {ol.style.FillRenderArgs} fillArgs The Fill arguments.
 * @param {ol.style.StrokeRenderArgs} strokeArgs The Stroke arguments.
 * @extends {ol.style.ReplayArgs}
 * @api
 */
ol.style.TextRenderArgs = function(tolerance, maximumExtent, resolution, projection,
                                   font, offsetX, offsetY, scale, rotation, text,
                                   textAlign, textBaseline, fillArgs, strokeArgs) {

  ol.style.ReplayArgs.call(this, tolerance, maximumExtent, resolution, projection);

  this.font_ = font;
  this.offsetX = offsetX;
  this.offsetY = offsetY;
  this.scale = scale;
  this.rotation = rotation;
  this.text = text;
  this.textAlign = textAlign;
  this.textBaseline = textBaseline;
  this.fillArgs = fillArgs;
  this.strokeArgs = strokeArgs;
};
goog.inherits(ol.style.TextRenderArgs, ol.style.ReplayArgs);

/**
 * Get the CSS-like string to configure the font options of the text.
 * @returns {string}
 */
ol.style.TextRenderArgs.prototype.getFont = function() {
  return this.font_;
};

/**
 * Set the CSS-like string to configure the font options of the text.
 * @param {string} font
 */
ol.style.TextRenderArgs.prototype.setFont = function(font) {
  this.font_ = font;
};

/**
 * Get the height of the text, in pixels, as described in the font property.
 * @returns {number}
 * @readonly
 */
ol.style.TextRenderArgs.prototype.getHeight = function() {
  var cssHelpers = new ol.style.CssHelpers();
  return cssHelpers.getHeight(this.font_);
};

/**
 *
 * @param {Array<number>} extent The extent of the zone of the text to draw, without scale or rotation modifications.
 * @param {Array<number>} centerCoordinates The reference point for positioning the text.
 * @returns {Array<number>} The four corners of the text block, taking into account the scale and the rotation of
 * the text. The order of corners is [top-left, top-right, bottom-right, bottom-left].
 * @private
 */
ol.style.TextRenderArgs.prototype.projectTextBlock_ = function(extent, centerCoordinates) {
  var localTransform = goog.vec.Mat4.createNumber();
  ol.vec.Mat4.makeTransform2D(
    localTransform, centerCoordinates[0], centerCoordinates[1],
    this.scale * this.pixelRatio, this.scale * this.pixelRatio,
    this.rotation, -centerCoordinates[0], -centerCoordinates[1]);

  var topLeftProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[0], extent[1], 0, 1], topLeftProj);

  var topRightProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[2], extent[1], 0, 1], topRightProj);

  var bottomRightProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[2], extent[3], 0, 1], bottomRightProj);

  var bottomLeftProj = [];
  goog.vec.Mat4.multVec4(localTransform, [extent[0], extent[3], 0, 1], bottomLeftProj);

  return [topLeftProj[0], topLeftProj[1],
    topRightProj[0], topRightProj[1],
    bottomRightProj[0], bottomRightProj[1],
    bottomLeftProj[0], bottomLeftProj[1]];
};

/**
 * Compute the extent of the text block, after the scale and rotation have been applied.
 * @param {Array<Array<number>>} textBlock The coordinates of the four corners of the text block, after applying scale and
 * rotation modifications. The order of corners is [top-left, top-right, bottom-right, bottom-left].
 * @returns {Array<number>} The extent of the text block, taking into account the scale and the rotation of the text.
 * Coordinates are in the following order: [minx, miny, maxx, maxy].
 * @api
 */
ol.style.TextRenderArgs.prototype.getTextBlockExtent = function(textBlock) {

  var topLeftProj = textBlock[0];
  var topRightProj = textBlock[1];
  var bottomRightProj = textBlock[2];
  var bottomLeftProj = textBlock[3];

  var minx = Math.min(topLeftProj[0], topRightProj[0], bottomRightProj[0], bottomLeftProj[0]);
  var maxx = Math.max(topLeftProj[0], topRightProj[0], bottomRightProj[0], bottomLeftProj[0]);
  var miny = Math.min(topLeftProj[1], topRightProj[1], bottomRightProj[1], bottomLeftProj[1]);
  var maxy = Math.max(topLeftProj[1], topRightProj[1], bottomRightProj[1], bottomLeftProj[1]);

  return [minx, miny, maxx, maxy];
};

/**
 * Compute the four corners of the block occupied by the text.
 * @param coordinates {Array<number>} The coordinates of the reference point.
 * @param context {CanvasRenderingContext2D} The CanvasContext on which text is displayed.
 * @param padding {number=} Optional. The padding in pixels around the text block.
 * @returns {Array<number>} The four corners of the text block, taking into account the scale and the rotation of
 * the text. The order of corners is [top-left, top-right, bottom-right, bottom-left].
 * @api
 */
ol.style.TextRenderArgs.prototype.getTextBlockCorners = function (coordinates, context, padding) {
  //Measure width of the text. Save and restore current font.
  var font = this.getFont();
  var prevFont;

  if (context.font !== font) {
    prevFont = context.font;
    context.font = font;
  }

  var width = context.measureText(this.text).width;

  if (prevFont) {
    context.font = prevFont;
  }

  var height = this.getHeight();

  var anchorX = coordinates[0];
  var anchorY = coordinates[1];

  //Top-left corner offset. Depends of textAlign and textBaseline properties
  var offsetX = 0;
  switch (this.textAlign) {
    case "start":
    case "left":
      offsetX = 0;
      break;
    case "center":
      offsetX = -width * 0.5;
      break;
    case "end":
    case "right":
      offsetX = -width;
      break;
  }

  var offsetY = 0;
  switch (this.textBaseline) {
    case "top":
      offsetY = 0;
      break;
    case "hanging":
    case "middle":
    case "alphabetic":
    case "ideographic":
      offsetY = -height * 0.5;
      break;
    case "bottom":
      offsetY = -height;
      break;
  }
  var x = coordinates[0] + offsetX;
  var y = coordinates[1] + offsetY;

  var extent = [x - padding, y - padding, x + width + padding, y + height + padding];

  return this.projectTextBlock_(extent, coordinates);
};

/**
 * Compute the screen rectangle occupied by the text.
 * @param coordinates {Array<number>} The coordinates of the reference point.
 * @param context {CanvasRenderingContext2D} The CanvasContext on which text is displayed.
 * @param padding {number=} Optional. The padding in pixels around the text block.
 * @returns {Array<number>} The extent of the zone covered by the text (in viewport coordinates), in the
 * [minx, miny, maxx, maxy] format.
 * @api
 */
ol.style.TextRenderArgs.prototype.getExtent = function (coordinates, context, padding) {
  var textBlock = this.getTextBlockCorners(coordinates, context, padding);
  return ol.style.getExtentFromFlatCoordinates(textBlock);
  //return this.getTextBlockExtent(textBlock);
};
//endregion
