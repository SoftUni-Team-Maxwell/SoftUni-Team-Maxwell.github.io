// TODO(Inspix): Unfinished.. Goal is to pack multiple uses of same textures into one draw call;
//               If I can figure out the problem with the sampler2D arrays that seem to be limited
//               to 16 active textures at once in WebGL.

function SpriteBatchFast(glContext) {
  this.glContext = glContext;
  var gl = glContext;
  var shader = gl.defaultShader;

  var MAXSPRITES = 1000;
  /* PositionX, PositionY, PositionZ, UVx, UVy, Rotation, Color     */
  var vertexComponents = 7;
  var vertexSize = vertexComponents * 4;

  var bufferData = new ArrayBuffer(MAXSPRITES * vertexSize * 4);
  var vertexData = new Float32Array(bufferData);
  var vertexColors = new Uint32Array(bufferData);
  this.VertexRotationBuffer = null;
  this.IndexBuffer = null;
  this.indicies = new Uint16Array(MAXSPRITES * 6);

  this.currentSize = 0;
  init();
  var MAXTEXTURES = 16;
  this.sprites = [];
  this.begin = function() {
    sprites = [];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexRotationBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
    gl.enableVertexAttribArray(shader.aLocations.aPosition);
    gl.enableVertexAttribArray(shader.aLocations.aTexCoord);
    gl.enableVertexAttribArray(shader.aLocations.aRotation);
    gl.enableVertexAttribArray(shader.aLocations.aColor);
    gl.vertexAttribPointer(shader.aLocations.aPosition, 3, gl.FLOAT, false, vertexSize, 0);
    gl.vertexAttribPointer(shader.aLocations.aTexCoord, 2, gl.FLOAT, false, vertexSize, 4 * 3);
    gl.vertexAttribPointer(shader.aLocations.aRotation, 1, gl.FLOAT, false, vertexSize, 4 * 5);
    gl.vertexAttribPointer(shader.aLocations.aColor, 4, gl.UNSIGNED_BYTE, true, vertexSize, 4 * 6);



  };

  this.draw = function(sprite, x, y, width, height, rotation, color, depth) {
    //console.log('Batch Draw');


    if (this.currentSize >= MAXSPRITES) {
      this.end();
      this.begin();
    }

    var index = this.currentSize * vertexSize;
    vertexData[index++] = x;
    vertexData[index++] = y;
    vertexData[index++] = depth;
    vertexData[index++] = 0.0;
    vertexData[index++] = 0.0;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;

    vertexData[index++] = x + width;
    vertexData[index++] = y;
    vertexData[index++] = depth;
    vertexData[index++] = 1.0;
    vertexData[index++] = 0.0;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;

    vertexData[index++] = x + width;
    vertexData[index++] = y + height;
    vertexData[index++] = depth;
    vertexData[index++] = 1;
    vertexData[index++] = 1;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;

    vertexData[index++] = x;
    vertexData[index++] = y + height;
    vertexData[index++] = depth;
    vertexData[index++] = 0;
    vertexData[index++] = 1.0;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;

    this.sprites[this.currentSize++] = sprite;
  };

  this.end = function() {
    if (this.currentSize <= 0) {
      return;
    }

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bufferData);

    var startingPoint = 0;
    var count = 0;
    //console.log(this.sprites[0]);
    var currentTexture = null;

    for (var i = 0; i < this.sprites.length - 1; i++) {
      var nextTexture = this.sprites[i].texture;


      if (currentTexture !== nextTexture) {
        this.render(currentTexture, count, startingPoint);
        currentTexture = nextTexture;
        count = 0;

      }
      count++;
    }
    this.render(currentTexture, count, startingPoint);

    this.currentSize = 0;
  };

  this.init = function() {
    this.VertexRotationBuffer = gl.createBuffer();
    this.IndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexRotationBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.bufferData, gl.DYNAMIC_DRAW);


    var offset = 0;
    for (var i = 0; i < this.indicies.length; i += 6) {
      this.indicies[i] = offset;
      this.indicies[i + 1] = offset + 1;
      this.indicies[i + 2] = offset + 2;
      this.indicies[i + 3] = offset + 2;
      this.indicies[i + 4] = offset + 3;
      this.indicies[i + 5] = offset;

      offset += 4;
      if (i === this.indicies.length - 6) {
        console.log(this.indicies);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies, gl.STATIC_DRAW);
      }
    }
  };
}
