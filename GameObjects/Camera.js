
// NOTE(Inspix): Translation camera, used to move the Primary Camera
function Camera(mat4){
  if (!(mat4 instanceof Mat4)) {
    throw 'Cannot Create camera without a 4x4 Matrix';
  }

  this._matrix = mat4;

}

Camera.prototype = {
  constructor : Camera,
  get x() {return this._matrix.values[12] * -1;},
  set x(value) {
    if (isNaN(value)) {
      return;
    }
    this._matrix.values[12] = value * -1;
  },
  get y() {return this._matrix.values[13] * -1;},
  set y(value) {
    if (isNaN(value)) {
      return;
    }
    this._matrix.values[13] = value;
  },
  get Matrix() {return this._matrix;}
};
