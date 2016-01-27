function Rect(x, y, width, heigth) {
  if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(heigth)) {
    throw 'Cannot construct Rect from non number variables';
  }
  this._x = x;
  this._y = y;
  this._width = width;
  this._height = heigth;
}

Rect.prototype = {
  get x() {
    return this._x;
  },
  set x(value) {
    if (isNaN(value)) return;
    this._x = value;
  },
  get y() {
    return this._y;
  },
  set y(value) {
    if (isNaN(value)) return;
    this._y = value;
  },
  get width() {
    return this._width;
  },
  set width(value) {
    if (isNaN(value)) return;
    this._width = value;
  },
  get height() {
    return this._height;
  },
  set height(value) {
    if (isNaN(value)) return;
    this._height = value;
  },
  get top() { return this._y+this._height;},
  get bottom() { return this._y;},
  get left() { return this._x;},
  get right() { return this._x+this._width;},
  ContainsPoint : function(xPos,yPos){
    var x,y;
    if (xPos instanceof Vec2) {
      x = xPos.x;
      y = xPos.y;
    }else {
      x = xPos;
      y = yPos;
    }
    var xIn = this._x <= x && this._x + this._width >= x;
    var yIn = this._y <= y && this._y + this._height >= y;

    return xIn && yIn;
  }
};
