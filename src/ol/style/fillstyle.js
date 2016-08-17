goog.provide('ol.style.Fill');

goog.require('ol.color');


/**
 * @classdesc
 * Set fill style for vector features.
 *
 * @constructor
 * @param {olx.style.FillOptions=} opt_options Options.
 * @api
 */
ol.style.Fill = function(opt_options) {

  var options = opt_options || {};

  /**
   * @private
   * @type {ol.Color|ol.ColorLike}
   */
  this.color_ = options.color !== undefined ? options.color : null;

  /**
   * @private
   * @type {string|undefined}
   */
  this.checksum_ = undefined;

  /**
   * @private
   * @type {ol.style.FillRenderFunction|undefined}
   */
  this.preRender_ = options.preRender;

  /**
   * @private
   * @type {ol.style.FillRenderFunction|undefined}
   */
  this.postRender_ = options.postRender;

  /**
   * @private
   * @type {ol.style.FillRenderFunction|undefined}
   */
  this.foregroundRender_ = options.foregroundRender;
};


/**
 * Get the fill color.
 * @return {ol.Color|ol.ColorLike} Color.
 * @api
 */
ol.style.Fill.prototype.getColor = function() {
  return this.color_;
};


/**
 * Set the color.
 *
 * @param {ol.Color|ol.ColorLike} color Color.
 * @api
 */
ol.style.Fill.prototype.setColor = function(color) {
  this.color_ = color;
  this.checksum_ = undefined;
};


/**
 * Get the pre-render function, executed before OL3 normal rendering pass.
 * @return {ol.style.FillRenderFunction|undefined} Render function.
 * @api
 */
ol.style.Fill.prototype.getPreRender = function() {
  return this.preRender_;
};


/**
 * Get the post-render function, executed after OL3 normal rendering pass.
 * @return {ol.style.FillRenderFunction|undefined} Render function.
 * @api
 */
ol.style.Fill.prototype.getPostRender = function() {
  return this.postRender_;
};


/**
 * Get the render function, executed after map normal rendering pass.
 * @return {ol.style.FillRenderFunction|undefined} Render function.
 * @api
 */
ol.style.Fill.prototype.getForegroundRender = function() {
  return this.foregroundRender_;
};


/**
 * Set the pre-render function.
 *
 * @param {ol.style.FillRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.Fill.prototype.setPreRender = function(renderFunction) {
  this.preRender_ = renderFunction;
};


/**
 * Set the post-render function.
 *
 * @param {ol.style.FillRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.Fill.prototype.setPostRender = function(renderFunction) {
  this.postRender_ = renderFunction;
};


/**
 * Set the foreground render function, executed after map normal rendering pass.
 *
 * @param {ol.style.FillRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.Fill.prototype.setForegroundRender = function(renderFunction) {
  this.foregroundRender_ = renderFunction;
};


/**
 * @return {string} The checksum.
 */
ol.style.Fill.prototype.getChecksum = function() {
  if (this.checksum_ === undefined) {
    if (
        this.color_ instanceof CanvasPattern ||
        this.color_ instanceof CanvasGradient
    ) {
      this.checksum_ = goog.getUid(this.color_).toString();
    } else {
      this.checksum_ = 'f' + (this.color_ ?
          ol.color.asString(this.color_) : '-');
    }
  }

  return this.checksum_;
};
