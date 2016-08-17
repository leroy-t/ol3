goog.provide('ol.vec.Segment');
goog.provide('ol.vec.IntersectionResult');

goog.require('ol.vec.Vector2');

/**
 * @classdesc
 * Representation of a segment delimited by a start point and an end point.
 *
 * @constructor
 * @param {ol.Coordinate} start Start point of the segment.
 * @param {ol.Coordinate} end End point of the segment.
 * @api
 */
ol.vec.Segment = function (start, end) {
  if (!Array.isArray(start)) {
    throw new Error("Start must be an array containing 2 numbers.");
  }
  if (start.length !== 2) {
    throw new Error("Start must be an array containing 2 numbers.");
  }
  if (!Array.isArray(end)) {
    throw new Error("End must be an array containing 2 numbers.");
  }
  if (end.length !== 2) {
    throw new Error("End must be an array containing 2 numbers.");
  }

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.start_ = start;

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.end_ = end;

  /**
   * @private
   * @type {boolean}
   */
  this.isVectorDirty_ = true;

  /**
   * @private
   * @type {ol.vec.Vector2}
   */
  this.vector_ = null;
};

/**
 * Get the start point of the segment.
 *
 * @return {ol.Coordinate}
 * @api
 */
ol.vec.Segment.prototype.getStart = function () {
  return this.start_;
};

/**
 * Set the start point of the segment.
 *
 * @param {ol.Coordinate} value The new start point of the segment.
 * @api
 */
ol.vec.Segment.prototype.setStart = function (value) {
  if (!Array.isArray(value)) {
    throw new Error("Start must be an array containing 2 numbers.");
  }
  if (value.length !== 2) {
    throw new Error("Start must be an array containing 2 numbers.");
  }

  this.start_ = value;
  this.isVectorDirty_ = true;
};

/**
 * Get the end point of the segment.
 *
 * @return {ol.Coordinate}
 * @api
 */
ol.vec.Segment.prototype.getEnd = function () {
  return this.end_;
};

/**
 * Set the end point of the segment.
 *
 * @param {ol.Coordinate} value The new end point of the segment.
 * @api
 */
ol.vec.Segment.prototype.setEnd = function (value) {
  if (!Array.isArray(value)) {
    throw new Error("End must be an array containing 2 numbers.");
  }
  if (value.length !== 2) {
    throw new Error("End must be an array containing 2 numbers.");
  }

  this.end_ = value;
  this.isVectorDirty_ = true;
};

/**
 * Get the vector going from the start point to the end point.
 *
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Segment.prototype.vector = function () {
  if (this.isVectorDirty_) {
    this.updateVector_();
  }

  return this.vector_;
};

/**
 * Get the length of the segment.
 *
 * @return {number}
 * @api
 */
ol.vec.Segment.prototype.length = function () {
  return this.vector().length();
};

/**
 * Get the angle of the segment.
 *
 * @return {number}
 * @api
 */
ol.vec.Segment.prototype.angle = function () {
  return this.vector().angle();
};

/**
 * Compute the intersection between two segments.
 *
 * @param {ol.vec.Segment} segment1
 * @param {ol.vec.Segment} segment2
 * @return {ol.vec.IntersectionResult}
 * @api
 */
ol.vec.Segment.getIntersection = function (segment1, segment2) {
  if (!segment1) {
    throw new Error("Segment 1 cannot be null.");
  }

  if (!(segment1 instanceof ol.vec.Segment)) {
    throw new Error("Segment 1 must be a segment.");
  }

  if (!segment2) {
    throw new Error("Segment 2 cannot be null.");
  }

  if (!(segment2 instanceof ol.vec.Segment)) {
    throw new Error("Segment 2 must be a segment.");
  }

  //If the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite)
  //and booleans for whether line segment 1 or line segment 2 contain the point.
  var result = {
    x: null,
    y: null,
    onLine1: false,
    onLine2: false,
    intersects: false
  };

  var denominator = (segment2.vector().getY() * segment1.vector().getX()) - (segment2.vector().getX() * segment1.vector().getY());
  if (denominator === 0) {
    return result;
  }

  var a = segment1.getStart()[1] - segment2.getStart()[1];
  var b = segment1.getStart()[0] - segment2.getStart()[0];
  var numerator1 = (segment2.vector().getX() * a) - (segment2.vector().getY() * b);
  var numerator2 = (segment1.vector().getX() * a) - (segment1.vector().getY() * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  result.x = segment1.getStart()[0] + (a * segment1.vector().getX());
  result.y = segment1.getStart()[1] + (a * segment1.vector().getY());

  //If line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }

  //If line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }

  if (result.onLine1 && result.onLine2) {
    result.intersects = true;
  }

  return result;
};


/**
 * Create an array of segments, from an array of flat coordinates.
 *
 * @param {Array.<number>} coordinates
 * @return {Array.<ol.vec.Segment>}
 * @api
 */
ol.vec.Segment.createFromFlatCoordinates = function (coordinates) {
  if (!Array.isArray(coordinates)) {
    throw new Error("Coordinates cannot be null.");
  }
  if (coordinates.length < 4) {
    return [];
  }
  var result = [];
  for (var i = 0; i < coordinates.length - 2; i += 2) {
    var start = [coordinates[i], coordinates[i + 1]];
    var end = [coordinates[i + 2], coordinates[i + 3]];

    result.push(new ol.vec.Segment(start, end));
  }

  return result;
};


/**
 * Extract a segment from an array of flat coordinates.
 *
 * @param {Array.<number>} coordinates
 * @param {number} index 0-based index of the segment to return.
 * @param {ol.vec.Segment|undefined} opt_segment Optional. A segment instance to update with the new values.
 * Reusing an instance reduces the work of the garbage collector, and can provide significant performance gains.
 * @return {ol.vec.Segment}
 * @api
 */
ol.vec.Segment.getSegmentFromFlatCoordinates = function (coordinates, index, opt_segment) {
  if (!Array.isArray(coordinates)) {
    throw new Error("Coordinates cannot be null.");
  }

  if (coordinates.length < 4) {
    throw new Error("Coordinates must contain at least 4 elements.");
  }

  if (index < 0) {
    throw new Error("Index should be superior to 0.");
  }

  if (index > coordinates.length / 2 - 1) {
    throw new Error("Index should be inferior to the number of coordinates - 1.");
  }

  index *= 2;

  var start = [coordinates[index], coordinates[index + 1]];
  var end = [coordinates[index + 2], coordinates[index + 3]];

  if (!opt_segment) {
    //No segment provided
    opt_segment = new ol.vec.Segment(start, end);
  } else {
    //Update provided segment
    if (!(opt_segment instanceof ol.vec.Segment)) {
      throw new Error("Opt_segment must be an ol.vec.Segment instance");
    }

    opt_segment.setStart(start);
    opt_segment.setEnd(end);
  }

  return opt_segment;
};

/**
 * Clip a segment so it fits in the provided segment.
 *
 * @param {ol.Extent} extent
 * @return {ol.vec.Segment|undefined}
 * @api
 */
ol.vec.Segment.prototype.clip = function (extent) {
  if (!extent) {
    throw new Error("Extent cannot be null.");
  }

  //Check if segment is contained in the extent
  var containsStart = ol.extent.containsCoordinate(extent, this.getStart());
  var containsEnd = ol.extent.containsCoordinate(extent, this.getEnd());

  //If the segment is contained in the extent, return a copy of it.
  if (containsStart && containsEnd) {
    //Return the original segment
    return this.clone();
  }

  //Start point must have the lowest x and lowest y components. If it is not the case, swap start and end
  var needSwap = this.end_[0] < this.start_[0] || this.end_[1] < this.start_[1];
  var segment = needSwap ? new ol.vec.Segment(this.end_.slice(0), this.start_.slice(0)) :
    new ol.vec.Segment(this.start_.slice(0), this.end_.slice(0));

  //Compute all segments represented by the envelope
  var top = new ol.vec.Segment([extent[0], extent[1]], [extent[2], extent[1]]);
  var bottom = new ol.vec.Segment([extent[0], extent[3]], [extent[2], extent[3]]);
  var left = new ol.vec.Segment([extent[0], extent[1]], [extent[0], extent[3]]);
  var right = new ol.vec.Segment([extent[2], extent[1]], [extent[2], extent[3]]);

  //Check if segment intersects with top of the envelope
  var topIntersection = ol.vec.Segment.getIntersection(segment, top);
  var bottomIntersection = ol.vec.Segment.getIntersection(segment, bottom);
  var leftIntersection = ol.vec.Segment.getIntersection(segment, left);
  var rightIntersection = ol.vec.Segment.getIntersection(segment, right);

  //Segment should be clipped only if it intersects with two sides of the envelope
  var intersectionCount = 0;
  var xArray = [];
  var yArray = [];

  //Intersection with left segment
  if (leftIntersection.intersects) {
    xArray.push(leftIntersection.x);
    yArray.push(leftIntersection.y);
    intersectionCount++;
  }

  //Intersection with top segment
  if (topIntersection.intersects) {
    xArray.push(topIntersection.x);
    yArray.push(topIntersection.y);
    intersectionCount++;
  }

  //Intersection with right segment
  if (rightIntersection.intersects) {
    xArray.push(rightIntersection.x);
    yArray.push(rightIntersection.y);
    intersectionCount++;
  }

  //Intersection with bottom segment
  if (bottomIntersection.intersects) {
    xArray.push(bottomIntersection.x);
    yArray.push(bottomIntersection.y);
    intersectionCount++;
  }

  if (intersectionCount === 0 || intersectionCount >= 3) {
    //No intersection between segment and envelope.
    return undefined;
  }

  if (intersectionCount === 1) {
    //If there is only one intersection, one point in contained in the extent, and the other is outside
    //Coordinates of the contained point should be added to the xArray and yArray structures.
    if (containsStart) {
      xArray.push(this.getStart()[0]);
      yArray.push(this.getStart()[1]);
    }

    if (containsEnd) {
      xArray.push(this.getEnd()[0]);
      yArray.push(this.getEnd()[1]);
    }
  }

  //Compute start coordinates (min of x and y arrays)
  var startX = segment.getStart()[0] < segment.getEnd()[0] ?
    Math.min.apply(null, xArray) : Math.max.apply(null, xArray);
  var startY = segment.getStart()[1] < segment.getEnd()[1] ?
    Math.min.apply(null, yArray) : Math.max.apply(null, yArray);
  var endX = segment.getEnd()[0] < segment.getStart()[0] ?
    Math.min.apply(null, xArray) : Math.max.apply(null, xArray);
  var endY = segment.getEnd()[1] < segment.getStart()[1] ?
    Math.min.apply(null, yArray) : Math.max.apply(null, yArray);

  //If end and start were swapped, restore the original order for result segment
  return needSwap ? new ol.vec.Segment([endX, endY], [startX, startY]) : new ol.vec.Segment([startX, startY], [endX, endY]);
};

/**
 * Clone the current segment.
 *
 * @return {ol.vec.Segment}
 * @api
 */
ol.vec.Segment.prototype.clone = function () {
  return new ol.vec.Segment([this.start_[0], this.start_[1]], [this.end_[0], this.end_[1]]);
};

/**
 * @private
 */
ol.vec.Segment.prototype.updateVector_ = function () {
  this.vector_ = new ol.vec.Vector2(this.end_[0] - this.start_[0], this.end_[1] - this.start_[1]);
  this.isVectorDirty_ = false;
};
