var Identity = new Mat4(1);

function Mat4(diagonal) {

  this.setIdentity = function(value) {
    var amount = 1;
    if (!isNaN(value)) {
      amount = value;
    }
    this.values = new Float32Array(16);
    this.values[4 * 0 + 0] = amount;
    this.values[4 * 1 + 1] = amount;
    this.values[4 * 2 + 2] = amount;
    this.values[4 * 3 + 3] = amount;
    return this;
  };

  this.setTranslation = function(a, b, c) {
    var x, y, z;
    if (a instanceof Vec3) {
      x = a.x;
      y = a.y;
      z = a.z;
    } else {
      x = a;
      y = b;
      z = c;
    }
    this.setIdentity();
    this.values[4 * 3 + 0] = x;
    this.values[4 * 3 + 1] = y;
    this.values[4 * 3 + 2] = z;
    return this;
  };

  this.setRotation = function(angle, x, y, z) {
    var tetha = angle;
    if (isNaN(angle)) {
      tetha = 0;
    }
    var xAxis, yAxis, zAxis;
    if (x instanceof Vec3) {
      xAxis = x.x;
      yAxis = x.y;
      zAxis = x.z;
    } else {
      xAxis = x;
      yAxis = y;
      zAxis = z;
    }


    var r = toRadians(tetha);
    var c = Math.cos(r);
    var s = Math.sin(r);
    var oneMinusC = 1.0 - c;

    this.values[0] = xAxis * oneMinusC + c;
    this.values[1] = xAxis * yAxis * oneMinusC + zAxis * s;
    this.values[2] = xAxis * zAxis * oneMinusC - yAxis * s;

    this.values[4] = xAxis * yAxis * oneMinusC - zAxis * s;
    this.values[5] = yAxis * oneMinusC + c;
    this.values[6] = yAxis * zAxis * oneMinusC + xAxis * s;

    this.values[8] = xAxis * zAxis * oneMinusC + yAxis * s;
    this.values[9] = yAxis * zAxis * oneMinusC - xAxis * s;
    this.values[10] = zAxis * oneMinusC + c;
    this.values[15] = 1.0;

    return this;
  };

  this.setScale = function(x, y, z) {
    var xScale, yScale, zScale;
    if (x instanceof Vec3) {
      xScale = x.x;
      yScale = x.y;
      zScale = x.z;
    } else {
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        xScale = x;
        yScale = y;
        zScale = z;
      } else {
        throw 'setScale variables must be numbers';
      }
    }

    this.setIdentity();

    this.values[0] = xScale;
    this.values[5] = yScale;
    this.values[10] = zScale;

    return this;
  };

  this.multiply = function(other){
    if (other instanceof Mat4) {
      var temp = new Float32Array(16);
			for (var col = 0; col < 4; col++)
			{
				for (var row = 0; row < 4; row++)
				{
					var sum = 0.0;
					for (var otherCol = 0; otherCol < 4; otherCol++)
					{
						sum += this.values[4 * otherCol + row] * other.values[4 * col + otherCol];
					}
					temp[4 * col + row] = sum;
				}
			}
      this.values = temp;
      return this;
    }
  };

  this.createOrtho = function(left,right,top,bottom,near,far){
    if (isNumberArray([left,right,top,bottom,near,far])) {

			this.values[0] = 2 / (right - left);
			this.values[5] = 2 / (top - bottom);
			this.values[10] = -2 / (far - near);
			this.values[12] = -(right + left) / (right - left);
			this.values[13] = -(top + bottom) / (top - bottom);
			this.values[14] = -(far + near) / (far - near);
      return this;
		}
  };

  this.setIdentity(diagonal);
}

function isNumberArray(array){
  for (var i = 0; i < array.length; i++) {
    if (isNaN(array[i])) {
      return false;
    }
  }
  return true;
}

function toRadians(a) {
  if (isNaN(a)) {
    throw 'value passed to toRadians is not a number';
  }
  return a * (Math.PI / 180);
}

function toDegrees(r) {
  if (isNaN(r)) {
    throw 'value passed to toDegrees is not a number';
  }
  return r * (180 / Math.PI);
}
