function drawRectangle(context, extent, pathRenderFunction) {
  var width = extent[2] - extent[0];
  var height = extent[3] - extent[1];
  context.beginPath();
  context.rect(extent[0], extent[1], width, height);
  pathRenderFunction(context);
}

function drawRoundedRectangle(context, pixelRatio, x, y, width, height, cornerRadius, snapPixels) {
  if (!context) {
    throw new Error("Context cannot be null.");
  }
  if (typeof pixelRatio !== "number") {
    throw new Error("Pixel ratio must be a number.");
  }
  if (typeof x !== "number") {
    throw new Error("X must be a number.");
  }
  if (typeof y !== "number") {
    throw new Error("Y must be a number.");
  }
  if (typeof width !== "number") {
    throw new Error("Width must be a number.");
  }
  if (typeof height !== "number") {
    throw new Error("Height must be a number.");
  }
  if (typeof cornerRadius !== "number") {
    cornerRadius = 0;
  }

  //Take pixelRatio into account
  pixelRatio = 1;
  x *= pixelRatio;
  y *= pixelRatio;
  width *= pixelRatio;
  height *= pixelRatio;
  cornerRadius *= pixelRatio;

  if (cornerRadius === 0) {
    //Draw a simple rectangle
    context.rect(x, y, width, height);

    return;
  }
  var minx = snapPixels ? ~~x + 0.5 : x;
  var miny = snapPixels ? ~~y + 0.5 : y;
  var maxx = snapPixels ? ~~(x + width) + 0.5 : x + width;
  var maxy = snapPixels ? ~~(y + height) + 0.5 : y + height;
  context.moveTo(minx + cornerRadius, miny);
  //Top
  context.lineTo(maxx - cornerRadius, miny);
  //Top-right corner
  context.quadraticCurveTo(maxx, miny, maxx, miny + cornerRadius);
  //Right
  context.lineTo(maxx, maxy - cornerRadius);
  //Bottom-right corner
  context.quadraticCurveTo(maxx, maxy, maxx - cornerRadius, maxy);
  //Bottom
  context.lineTo(minx + cornerRadius, maxy);
  //Bottom-left corner
  context.quadraticCurveTo(minx, maxy, minx, maxy - cornerRadius);
  //Left
  context.lineTo(minx, miny + cornerRadius);
  //Top-left corner
  context.quadraticCurveTo(minx, miny, minx + cornerRadius, miny);
}

function buildPathRenderFunction(fill, stroke) {
  var func = function (context) {
    configureContextStyle(context, fill, stroke);
    if (fill) {
      context.fill();
    }
    if (stroke) {
      context.stroke();
    }
  };

  return func;
}

function configureContextStyle(context, fill, stroke) {
  if (fill) {
    context.fillStyle = fill;
  }
  if (stroke) {
    if (stroke.style) {
      context.strokeStyle = stroke.style;
    }
    if (typeof stroke.width === "number") {
      context.lineWidth = stroke.width;
    }
    if (stroke.dashArray) {
      context.setLineDash(stroke.dashArray);
    }
    if (typeof stroke.dashOffset === "number") {
      context.lineDashOffset = stroke.dashOffset;
    }
    if (stroke.lineCap) {
      context.lineCap = stroke.lineCap;
    }
    if (stroke.lineJoin) {
      context.lineJoin = stroke.lineJoin;
    }
    if (stroke.miterLimit) {
      context.miterLimit = stroke.miterLimit;
    }
  }
}

function drawPath(context, coordinates, closePath, pathRenderFunction) {
  context.beginPath();
  context.moveTo(coordinates[0], coordinates[1]);
  for (var i = 2; i < coordinates.length; i += 2) {
    context.lineTo(coordinates[i], coordinates[i + 1]);
  }
  if (closePath) context.closePath();
  pathRenderFunction(context);
}

function drawPolyline(context, coordinates, pathRenderFunction) {
  drawPath(context, coordinates, false, pathRenderFunction);
}

function drawPolygon(context, coordinates, pathRenderFunction) {
  drawPath(context, coordinates, true, pathRenderFunction);
}
