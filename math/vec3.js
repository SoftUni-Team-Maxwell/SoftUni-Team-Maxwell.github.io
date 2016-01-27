function Vec3(a,b,c){
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw 'Cannot construct Vec3 from non number variables';
  }

  this._x = a;
  this._y = b;
  this._z = c;

  // NOTE(Inspix): Add more operations that could be useful.

  this.add = function(other){
    if (other instanceof Vec3) {
      this._x += other.x;
      this._y += other.y;
      this._z += other.z;
    }
  };

  this.substract = function(other){
    if(other instanceof Vec3){
      this._x -= other.x;
      this._y -= other.y;
      this._z -= other.z;
    }
  };

  this.multiply = function(other){
    if(other instanceof Vec3){
      this._x *= other.x;
      this._y *= other.y;
      this._z *= other.z;
    }
  };

  this.multiplyScalar = function(scalar){
    if (isNaN(scalar)) {
      return;
    }
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;
  };

  this.divide = function(other){
    if (other instanceof Vec3) {
      this._x /= other.x;
      this._y /= other.y;
      this._z /= other.z;
    }
  };

  this.divideScalar = function(scalar){
    if (isNaN(scalar) || scalar === 0.0) {
      console.error('Vector3 scalar divide by zero or NaN');
      return this;
    }
    this._x /= scalar;
    this._y /= scalar;
    this._z /= scalar;
  };

  this.divideScalarCopy = function(scalar){
      if (isNaN(scalar) || scalar === 0.0) {
        console.error('Vector3 scalar divide by zero or NaN');
        return this;
      }
      return new Vec2(this._x / scalar, this._y / scalar, this._z / scalar);
  };

  this.addCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x + other.x, this._y + other.y, this._z + other.z);
      return result;
    }
  };

  this.substractCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x - other.x, this._y - other.y, this._z - other.z);
      return result;
    }
  };

  this.multiplyCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x * other.x, this._y * other.y, this._z * other.z);
      return result;
    }
  };

  this.multiplyScalarCopy = function(scalar){
      if (isNaN(scalar)) {
        return;
      }
      return new Vec3(this._x * scalar, this._y * scalar, this._z * scalar);
  };

  this.divideCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x / other.x, this._y / other.y, this._z / other.z);
      return result;
    }
  };

  this.toArray = function(){
    return new Float32Array([x,y,z]);
  };

  this.toString = function(){
    return 'Vec3[' + this._x + ', ' + this._y + ', ' + this._z + ']';
  };
}

Vec3.prototype = {
  get x() { return this._x;},
  set x(value) {
    if (isNaN(value)) return;
    this._x = value;
  },
  get y() { return this._y;},
  set y(value) {
    if (isNaN(value)) return;
    this._y = value;
  },
  get z() { return this._z;},
  set z(value) {
    if (isNaN(value)) return;
    this._z = value;
  }
};

Vec3.prototype.dot = function(other) {
  if (other instanceof Vec3) {
    return this._x * other.x + this._y * other.y + this._z * other.z;
  }
};

Vec3.prototype.length = function() {
  if (other instanceof Vec3) {
    return Math.sqrt(this.dot(this));
  }
};

Vec3.prototype.normalize = function() {
  var length = this.length;
  if (length === 0.0) {
    return;
  }
  this._x /= length;
  this._y /= length;
  this._z /= length;
  return this;
};
