function Vec2(a,b){
  if (isNaN(a) || isNaN(b)) {
    throw 'Cannot construct Vec2 from non number variables';
  }

  this._x = a;
  this._y = b;

  this.add = function(other){
    if (other instanceof Vec2) {
      this._x += other.x;
      this._y += other.y;
    }
  };

  this.substract = function(other){
    if(other instanceof Vec2){
      this._x -= other.x;
      this._y -= other.y;
    }
  };

  this.multiply = function(other){
    if(other instanceof Vec2){
      this._x *= other.x;
      this._y *= other.y;
    }
  };

  this.multiplyScalar = function(scalar){
    if (isNaN(scalar)) {
      return;
    }
    this._x *= scalar;
    this._y *= scalar;
    return this;
  };

  this.divide = function(other){
    if (other instanceof Vec2) {
      this._x /= other.x;
      this._y /= other.y;
    }
  };

  this.divideScalar = function(scalar){
    if (isNaN(scalar) || scalar === 0.0) {
      return;
    }
    this._x /= scalar;
    this._y /= scalar;
  };

  this.addCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x + other.x, this._y + other.y);
      return result;
    }
  };

  this.substractCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x - other.x, this._y - other.y);
      return result;
    }
  };

  this.multiplyCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x * other.x, this._y * other.y);
      return result;
    }
  };

  this.multiplyScalarCopy = function(scalar){
      if (isNaN(scalar)) {
        return;
      }
      var result = new Vec2(this._x * scalar, this._y * scalar);
      return result;
  };

  this.divideCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x / other.x, this._y / other.y);
      return result;
    }
  };

  this.divideScalarCopy = function(scalar){
      if (isNaN(scalar) || scalar === 0.0) {
        return;
      }
      return new Vec2(this._x / scalar, this._y / scalar);
  };


  this.toArray = function(){
    return new Float32Array([x,y]);
  };

  this.toString = function(){
    return 'Vec2[' + this._x + ', ' + this._y;
  };
}

Vec2.prototype = {
  get x() { return this._x;},
  set x(value) {
    if (isNaN(value)) return;
    this._x = value;
  },
  get y() { return this._y;},
  set y(value) {
    if (isNaN(value)) return;
    this._y = value;
  }
};

Vec2.prototype.dot = function(other) {
  if (other instanceof Vec2) {
    return this._x * other.x + this._y * other.y;
  }
};

Vec2.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

Vec2.prototype.normalize = function() {
  var length = this.length();
  if (length === 0.0) {
    return this;
  }
  this._x /= length;
  this._y /= length;
  return this;
};
