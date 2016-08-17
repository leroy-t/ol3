goog.provide('ol.vec.Vector2');

/**
 * @classdesc
 * Representation of 2D vectors and points.
 *
 * @constructor
 * @param {number} x X component of the vector.
 * @param {number} y Y component of the vector.
 * @api
 */
ol.vec.Vector2 = function(x, y) {
  /**
   * @private
   * @type {number}
   */
  this.x_ = x;

  /**
   * @private
   * @type {number}
   */
  this.y_ = y;
};

/**
 * Get the X component of the vector.
 *
 * @return {number}
 * @api
 */
ol.vec.Vector2.prototype.getX = function() {
  return this.x_;
};

/**
 * Set the X component of the vector.
 *
 * @param {number} value
 * @api
 */
ol.vec.Vector2.prototype.setX = function(value) {
  this.x_ = value;
};

/**
 * Get the Y component of the vector.
 *
 * @return {number}
 * @api
 */
ol.vec.Vector2.prototype.getY = function() {
  return this.y_;
};

/**
 * Set the Y component of the vector.
 *
 * @param {number} value Value.
 * @api
 */
ol.vec.Vector2.prototype.setY = function(value) {
  this.y_ = value;
};

/**
 * Set both components of the vector to the provided value.
 *
 * @param {number} scalar
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.setScalar = function(scalar) {
  this.x_ = scalar;
  this.y_ = scalar;

  return this;
};

/**
 * Checks if the provided vector equals the current one.
 *
 * @param {ol.vec.Vector2} vector
 * @return {boolean}
 * @api
 */
ol.vec.Vector2.prototype.equals = function(vector) {
  return ((vector.x === this.x_) && (vector.y === this.y_));
};

/**
 * Clone the current vector.
 *
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.clone = function() {
  return new ol.vec.Vector2(this.x_, this.y_);
};

/**
 * Update the components of the current vector with the values of the provided vector.
 *
 * @param {ol.vec.Vector2} vector The vector to copy.
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.copy = function(vector) {
  this.x_ = vector.getX();
  this.y_ = vector.getY();
  return this;
};

/**
 * Add a vector to the current one.
 *
 * @param {ol.vec.Vector2} vector
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.add = function(vector) {
  this.x_ += vector.getX();
  this.y_ += vector.getY();
  return this;
};

/**
 * Substract a vector from the current one.
 *
 * @param {ol.vec.Vector2} vector
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.sub = function(vector) {
  this.x_ -= vector.getX();
  this.y_ -= vector.getY();
  return this;
};

/**
 * Multiply the components of the current vector by a number.
 *
 * @param {number} scalar
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.multiply = function(scalar) {
  this.x_ *= scalar;
  this.y_ *= scalar;
  return this;
};

/**
 * Divide the components of the current vector by a number.
 *
 * @param {number} scalar
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.divide = function(scalar) {
  this.x_ /= scalar;
  this.y_ /= scalar;
  return this;
};

/**
 * Compute the dot product between the current vector and the provided vector.
 * @param {ol.vec.Vector2} vector
 * @return {number}
 * @api
 */
ol.vec.Vector2.prototype.dot = function(vector) {
  return (this.x_ * vector.x + this.y_ * vector.y);
};

/**
 * Compute the squared length of the current vector.
 *
 * @return {number}
 * @api
 */
ol.vec.Vector2.prototype.lengthSq = function() {
  return this.x_ * this.x_ + this.y_ * this.y_;
};

/**
 * Compute the length of the current vector.
 *
 * @return {number}
 * @api
 */
ol.vec.Vector2.prototype.length = function() {
  return Math.sqrt(this.x_ * this.x_ + this.y_ * this.y_);
};

/**
 * Return a version of the current vector having a magnitude of 1.
 *
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.normalize = function() {
  return this.divide(this.length());
};

/**
 * Compute the angle of the current vector.
 * @return {number}
 * @api
 */
ol.vec.Vector2.prototype.angle = function() {
  var angle = Math.atan2(this.y_, this.x_);
  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  return angle;
};

/**
 * Rotate the current vector by 90° to the left.
 *
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.rotate90Left = function() {
  var tmpX = this.x_;
  this.x_ = -this.y_;
  this.y_ = tmpX;

  return this;
};

/**
 * Rotate the current vector by 90° to the right.
 *
 * @return {ol.vec.Vector2}
 * @api
 */
ol.vec.Vector2.prototype.rotate90Right = function() {
  var tmpX = this.x_;
  this.x_ = this.y_;
  this.y_ = -tmpX;

  return this;
};
