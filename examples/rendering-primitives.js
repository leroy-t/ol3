function drawRectangle(context, extent, pathRenderFunction) {
  var width = extent[2] - extent[0];
  var height = extent[3] - extent[1];
  context.beginPath();
  context.rect(extent[0], extent[1], width, height);
  pathRenderFunction(context);
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
