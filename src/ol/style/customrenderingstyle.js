goog.provide('ol.style.CustomRendering');


/**
 * @classdesc
 * Set a custom rendering style for vector features.
 *
 * @constructor
 * @param {olx.style.CustomRenderingOptions=} opt_options Options.
 * @api
 */
ol.style.CustomRendering = function(opt_options) {

  var options = opt_options || {};

  /**
   * @private
   * @type {ol.style.CustomRenderFunction}
   */
  this.render_ = options.render;

  var hitDetection = null;

  if (options.hitDetection === undefined) {
    hitDetection = options.render;
  }

  if (options.hitDetection) {
    hitDetection = options.hitDetection
  }

  /**
   * @private
   * @type {ol.style.CustomRenderFunction|null}
   */
  this.hitDetection_ = hitDetection;

  /**
   * @private
   * @type {ol.style.CustomRenderExtentFunction|undefined}
   */
  this.extentFunction_ = options.extentFunction;

  /**
   * @private
   * @type {ol.style.CustomRenderFunction|undefined}
   */
  this.preRender_ = options.preRender;

  /**
   * @private
   * @type {ol.style.CustomRenderFunction|undefined}
   */
  this.postRender_ = options.postRender;

  /**
   * @private
   * @type {ol.style.CustomRenderFunction|undefined}
   */
  this.foregroundRender_ = options.foregroundRender;
};


/**
 * Get the render function, executed in place of OL3 normal rendering pass.
 * @return {ol.style.CustomRenderFunction} Render function.
 * @api
 */
ol.style.CustomRendering.prototype.getRender = function() {
  return this.render_;
};


/**
 * Get the hit detection function, used to determine the outline of the feature, for hit detection purposes.
 * @return {ol.style.CustomRenderFunction|null} Render function.
 * @api
 */
ol.style.CustomRendering.prototype.getHitDetection = function() {
  return this.hitDetection_;
};


/**
 * A function used to return the extent of the hit detection shape of the feature. If null or undefined, feature
 * is not clickable.
 * @return {ol.style.CustomRenderExtentFunction|undefined}
 * @api
 */
ol.style.CustomRendering.prototype.getExtentFunction = function() {
  return this.extentFunction_;
};


/**
 * Get the pre-render function, executed before OL3 normal rendering pass.
 * @return {ol.style.CustomRenderFunction|undefined} Render function.
 * @api
 */
ol.style.CustomRendering.prototype.getPreRender = function() {
  return this.preRender_;
};


/**
 * Get the post-render function, executed after OL3 normal rendering pass.
 * @return {ol.style.CustomRenderFunction|undefined} Render function.
 * @api
 */
ol.style.CustomRendering.prototype.getPostRender = function() {
  return this.postRender_;
};


/**
 * Get the render function, executed after map normal rendering pass.
 * @return {ol.style.CustomRenderFunction|undefined} Render function.
 * @api
 */
ol.style.CustomRendering.prototype.getForegroundRender = function() {
  return this.foregroundRender_;
};


/**
 * Set the render function.
 *
 * @param {ol.style.CustomRenderFunction} renderFunction Render function.
 * @api
 */
ol.style.CustomRendering.prototype.setRender = function(renderFunction) {
  this.render_ = renderFunction;
};


/**
 * Set the hit detection function.
 *
 * @param {ol.style.CustomRenderFunction|null} renderFunction Render function.
 * @api
 */
ol.style.CustomRendering.prototype.setHitDetection = function(renderFunction) {
  this.hitDetection_ = renderFunction;
};


/**
 * Set the getExtent function.
 *
 * @param {ol.style.CustomRenderExtentFunction|undefined} extentFunction Extent function.
 * @api
 */
ol.style.CustomRendering.prototype.setExtentFunction = function(extentFunction) {
  this.extentFunction_ = extentFunction;
};


/**
 * Set the pre-render function.
 *
 * @param {ol.style.CustomRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.CustomRendering.prototype.setPreRender = function(renderFunction) {
  this.preRender_ = renderFunction;
};


/**
 * Set the post-render function.
 *
 * @param {ol.style.CustomRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.CustomRendering.prototype.setPostRender = function(renderFunction) {
  this.postRender_ = renderFunction;
};


/**
 * Set the foreground render function, executed after map normal rendering pass.
 *
 * @param {ol.style.CustomRenderFunction|undefined} renderFunction Render function.
 * @api
 */
ol.style.CustomRendering.prototype.setForegroundRender = function(renderFunction) {
  this.foregroundRender_ = renderFunction;
};
