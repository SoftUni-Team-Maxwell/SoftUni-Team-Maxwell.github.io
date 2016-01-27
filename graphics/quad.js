var defaultColors = new Uint32Array(
  [
     0xffffffff,
     0xffffffff,
    //  0xffffffff,
    //  0xffffffff
  ]
);

// NOTE(Inspix): Can be used for static untextured objects. Otherwise Sprite is superior.
function Quad(glContext, positionVec, width, heigth, colorArray){
  this.gl = glContext;
  this.shader = glContext.defaultShader;
  if (!(positionVec instanceof Vec3)) {
    throw 'Position must be specified as a Vec3 Object';
  }
  var x = positionVec.x;
  var y = positionVec.y;
  var z = positionVec.z;
  var vertecies = new Float32Array(
    [
       x,y,z,
       x + width,y, z,
      //  x + width, y + heigth, z,
      //  x, y + heigth, z,
    ]
  );

  var indicies = new Uint16Array(
    [
      0,1,
    //  2,
  //    2,3,0
    ]
  );

  var colors = defaultColors;

  this.vertexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, vertecies, this.gl.STATIC_DRAW);

  this.ibo = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indicies, this.gl.STATIC_DRAW);

  this.colorBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.colorBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null);

  this.draw = function(){
    this.gl.defaultShader.useProgram();
    var shader = this.gl.defaultShader;
    shader.setUniformi(false,shader.uLocations.useTexturing);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.ibo);
    this.gl.enableVertexAttribArray(shader.aLocations.aPosition);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexBuffer);
    this.gl.vertexAttribPointer(shader.aLocations.aPosition, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.colorBuffer);
    this.gl.enableVertexAttribArray(shader.aLocations.aColor);
    this.gl.vertexAttribPointer(shader.aLocations.aColor, 4, this.gl.UNSIGNED_BYTE, true, 0, 0);
    this.gl.lineWidth(5.0);
    this.gl.drawElements(this.gl.LINES, 2, this.gl.UNSIGNED_SHORT,0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null);

  };
}
