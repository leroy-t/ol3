goog.provide('ol.style.CssHelpers');

/**
 * @classdesc
 * Constructor of a ol.style.CssHelpers
 * @constructor
 * @api
 */
ol.style.CssHelpers = function() {

};

/**
 * Get the target height of a text described by a CSS style.
 * @param {string} font The CSS-like string describing the style of the text.
 * @return {number} The height in pixels of the text block.
 * @api
 */
ol.style.CssHelpers.prototype.getHeight = function(font) {

  var parsingFont = this.parseFont(font);
  var result;

  if(!parsingFont.sizeIsDefined && !parsingFont.heightIsDefined) {
    result = this.parseSize(parsingFont.lineHeight);
  }
  else if(!parsingFont.sizeIsDefined && parsingFont.heightIsDefined) {
    result = this.parseSize(parsingFont.lineHeight);
  }
  else if(parsingFont.sizeIsDefined && !parsingFont.heightIsDefined) {
    result = this.parseSize(parsingFont.fontSize);
  }
  else {
    var size = this.parseSize(parsingFont.fontSize);
    var height = this.parseSize(parsingFont.lineHeight);
    if (size > height) {
      result = size;
    } else if (height > size) {
      result = height;
    } else {
      result = height;
    }
  }
  return Number(result);
};


/**
 *
 * @returns {
 * {fontStyle: (*|string),
  * fontVariant: (*|string),
  * fontWeight: (*|string),
  * fontStretch: (*|string),
  * fontSize: (*|string),
  * lineHeight: (*|string),
  * fontFamily: (*|string)}}
 */
ol.style.CssHelpers.prototype.parseFont = function(font) {
  var fontResult = {
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    fontStretch: "normal",
    fontSize: "10px",
    fontFamily: "Arial",
    sizeIsDefined: true
  };

  if (!font) {
    return fontResult;
  }

  var regex = /\b(italic|oblique|normal)?\s*(small-caps|common-ligatures small-caps|normal)?\s*(bold|bolder|lighter|normal|[1-9]00)?\s*(ultra-condensed|extra-condensed|condensed|semi-condensed|normal|semi-expanded|expanded|extra-expanded|ultra-expanded)?\s*(xx-small|x-small|small|medium|large|x-large|xx-large|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))?(?:[\s*\/\s*](normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([\"\-,\w ]+)?/;
  var result = font.match(regex);
  fontResult = {
    fontStyle: result[1] || "normal",
    fontVariant: result[2] || "normal",
    fontWeight: result[3] || "normal",
    fontStretch: result[4] || "normal",
    fontSize: result[5],
    lineHeight: result[6],
    fontFamily: result[7] || "Arial",
    sizeIsDefined: true,
    heightIsDefined: true
  };

  if(!fontResult.fontSize) {
    fontResult.sizeIsDefined = false;
    fontResult.fontSize = "medium";
  }
  if(!fontResult.lineHeight) {
    fontResult.heightIsDefined = false;
    fontResult.lineHeight = "normal";
  }

  return fontResult;
};

/**
 *
 * @param size
 * @returns {*}
 */
ol.style.CssHelpers.prototype.parseSize = function(size) {
  var regexType = /(?:[.\d]+)?([a-z\%-]+)?/;
  var type = size.match(regexType);
  var value = size.match(/\b([.\d]+)/);
  var result;
  switch(type[1]) {
    case "px":
      result = value[1];
      break;
    case "pt":
      result = (96 / (72 * value[1]));
      break;
    case "pc":
      result = (96 / (72 * 12 * value[1]));
      break;
    case "em":
      result = (value[1] / 0.2);
      break;
    case "cm":
      result = (value * 96) / 2.54;
      break;
    case "mm":
      result = (value * 96 * 10) / 2.54;
      break;
    case "ex":
      //TODO
      break;
    case "in":
      result = (96 * value[1]);
      break;
    case "%":
      result = (value[1] / 20);
      break;
    case "xx-small":
      result = 16 / 4;
      break;
    case "x-small":
      result = (16 * 2) / 4;
      break;
    case "small":
      result = (16 * 3) / 4;
      break;
    case "medium":
      result = 16; //reference value 16px <=> font-size = 4 <=> medium
      break;
    case "large":
      result = (16 * 5) / 4;
      break;
    case "x-large":
      result = (16 * 6) / 4;
      break;
    case "xx-large":
      result = (16 * 7) / 4;
      break;
    case "normal":
      result = 50;
      break;
  }
  return result;
};
