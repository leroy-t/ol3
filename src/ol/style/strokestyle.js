goog.provide('ol.style.Stroke');

goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('ol.color');


/**
 * @classdesc
 * Set stroke style for vector features.
 * Note that the defaults given are the Canvas defaults, which will be used if
 * option is not defined. The `get` functions return whatever was entered in
 * the options; they will not return the default.
 *
 * @constructor
 * @param {olx.style.StrokeOptions=} opt_options Options.
 * @api
 */
ol.style.Stroke = function(opt_options) {

  var options = opt_options || {};

  /**
   * @private
   * @type {ol.Color|string}
   */
  this.color_ = options.color !== undefined ? options.color : null;

  /**
   * @private
   * @type {string|undefined}
   */
  this.lineCap_ = options.lineCap;

  /**
   * @private
   * @type {Array.<number>}
   */
  this.lineDash_ = options.lineDash !== undefined ? options.lineDash : null;

  /**
   * @private
   * @type {string|undefined}
   */
  this.lineJoin_ = options.lineJoin;

  /**
   * @private
   * @type {number|undefined}
   */
  this.miterLimit_ = options.miterLimit;

  /**
   * @private
   * @type {number|undefined}
   */
  this.width_ = options.width;

  /**
   * @private
   * @type {string|undefined}
   */
  this.checksum_ = undefined;

  /**
   * @private
   * @type {ol.style.StrokeRenderFunction|undefined}
   */
  this.preRender_ = options.preRender;

  /**
   * @private
   * @type {ol.style.StrokeRenderFunction|undefined}
   */
  this.postRender_ = options.postRender;

  /**
   * @private
   * @type {ol.style.StrokeRenderFunction|undefined}
   */
  this.foregroundRender_ = options.foregroundRender;
};


/**
 * Get the stroke color.
 * @return {ol.Color|string} Color.
 * @api
 */
ol.style.Stroke.prototype.getColor = function() {
  return this.color_;
};


/**
 * Get the line cap type for the stroke.
 * @return {string|undefined} Line cap.
 * @api
 */
ol.style.Stroke.prototype.getLineCap = function() {
  return this.lineCap_;
};


/**
 * Get the line dash style for the stroke.
 * @return {Array.<number>} Line dash.
 * @api
 */
ol.style.Stroke.prototype.getLineDash = function() {
  return this.lineDash_;
};


/**
 * Get the line join type for the stroke.
 * @return {string|undefined} Line join.
 * @api
 */
ol.style.Stroke.prototype.getLineJoin = function() {
  return this.lineJoin_;
};


/**
 * Get the miter limit for the stroke.
 * @return {number|undefined} Miter limit.
 * @api
 */
ol.style.Stroke.prototype.getMiterLimit = function() {
  return this.miterLimit_;
};


/**
 * Get the stroke width.
 * @return {number|undefined} Width.
 * @api
 */
ol.style.Stroke.prototype.getWidth = function() {
  return this.width_;
};


/**
 * Get the pre-render function, executed before OL3 normal rendering pass.
 * @return {ol.style.StrokeRenderFunction|undefined} Render function.
 * @api
 */
ol.style.Stroke.prototype.getPreRender = function() {
  return this.preRender_;
};


/**
 * Get the post-render function, executed after OL3 normal rendering pass.
 * @return {ol.style.StrokeRenderFunction|undefined} Render function.
 * @api
 */
ol.style.Stroke.prototype.getPostRender = function() {
  return this.postRender_;
};


/**
 * Get the render function, executed after map normal rendering pass.
 * @return {ol.style.StrokeRenderFunction|undefined} Render function.
 * @api
 */
ol.style.Stroke.prototype.getForegroundRender = function() {
  return this.foregroundRender_;
};


/**
 * Set the color.
 *
 * @param {ol.Color|string} color Color.
 * @api
 */
ol.style.Stroke.prototype.setColor = function(color) {
  this.color_ = color;
  this.checksum_ = undefined;
};


/**
 * Set the line cap.
 *
 * @param {string|undefined} lineCap Line cap.
 * @api
 */
ol.style.Stroke.prototype.setLineCap = function(lineCap) {
  this.lineCap_ = lineCap;
  this.checksum_ = undefined;
};


/**
 * Set the line dash.
 *
 * Please note that Internet Explorer 10 and lower [do not support][mdn] the
 * `setLineDash` method on the `CanvasRenderingContext2D` and therefore this
 * property will have no visual effect in these browsers.
 *
 * [mdn]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility
 *
 * @param {Array.<number>} lineDash Line dash.
 * @api
 */
ol.style.Stroke.prototype.setLineDash = function(lineDash) {
  this.lineDash_ = lineDash;
  this.checksum_ = undefined;
};


/**
 * Set the line join.
 *
 * @param {string|undefined} lineJoin Line join.
 * @api
 */
ol.style.Stroke.prototype.setLineJoin = function(lineJoin) {
  this.lineJoin_ = lineJoin;
  this.checksum_ = undefined;
};


/**
 * Set the miter limit.
 *
 * @param {number|undefined} miterLimit Miter limit.
 * @api
 */
ol.style.Stroke.prototype.setMiterLimit = function(miterLimit) {
  this.miterLimit_ = miterLimit;
  this.checksum_ = undefined;
};


/**
 * Set the width.
 *
 * @param {number|undefined} width Width.
 * @api
 */
ol.style.Stroke.prototype.setWidth = function(width) {
  this.width_ = width;
  this.checksum_ = undefined;
};


/**
 * Set the pre-render function.
 *
 * @param {ol.style.StrokeRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.Stroke.prototype.setPreRender = function(renderFunction) {
  this.preRender_ = renderFunction;
};


/**
 * Set the post-render function.
 *
 * @param {ol.style.StrokeRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.Stroke.prototype.setPostRender = function(renderFunction) {
  this.postRender_ = renderFunction;
};


/**
 * Set the foreground render function, executed after map normal rendering pass.
 *
 * @param {ol.style.StrokeRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.Stroke.prototype.setForegroundRender = function(renderFunction) {
  this.foregroundRender_ = renderFunction;
};


/**
 * @return {string} The checksum.
 */
ol.style.Stroke.prototype.getChecksum = function() {
  if (this.checksum_ === undefined) {
    var raw = 's' +
        (this.color_ ?
            ol.color.asString(this.color_) : '-') + ',' +
        (this.lineCap_ !== undefined ?
            this.lineCap_.toString() : '-') + ',' +
        (this.lineDash_ ?
            this.lineDash_.toString() : '-') + ',' +
        (this.lineJoin_ !== undefined ?
            this.lineJoin_ : '-') + ',' +
        (this.miterLimit_ !== undefined ?
            this.miterLimit_.toString() : '-') + ',' +
        (this.width_ !== undefined ?
            this.width_.toString() : '-');

    var md5 = new goog.crypt.Md5();
    md5.update(raw);
    this.checksum_ = goog.crypt.byteArrayToString(md5.digest());
  }

  return this.checksum_;
};
