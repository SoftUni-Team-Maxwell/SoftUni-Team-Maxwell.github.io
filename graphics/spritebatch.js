// NOTE(Inspix): Slow Implementation until i figure out a better way to Render, with less draw calls.
function SpriteBatch(glContext) {
  this.gl = glContext;
  var vertexComponents = 11;
  var vertexSize = vertexComponents * Float32Array.BYTES_PER_ELEMENT;

  this._bufferData = new ArrayBuffer(vertexSize * 4);
  this._vertexData = new Float32Array(this._bufferData);
  this._vertexColors = new Uint32Array(this._bufferData);

  this.VertexDataBuffer = this.gl.createBuffer();
  this.IndexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexDataBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, this._bufferData, this.gl.DYNAMIC_DRAW);

  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 3, 0]), this.gl.DYNAMIC_DRAW);


  this.begin = function() {
    var shader = this.gl.activeShader;
    this.gl.enableVertexAttribArray(shader.aLocations.aPosition);
    this.gl.enableVertexAttribArray(shader.aLocations.aTexCoord);
    this.gl.enableVertexAttribArray(shader.aLocations.aRotation);
    this.gl.enableVertexAttribArray(shader.aLocations.aColor);
    this.gl.enableVertexAttribArray(shader.aLocations.aTPosition);
    this.gl.enableVertexAttribArray(shader.aLocations.aTOrigin);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexDataBuffer);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexDataBuffer);
    this.gl.vertexAttribPointer(shader.aLocations.aPosition, 3, this.gl.FLOAT, false, vertexSize, 0);
    this.gl.vertexAttribPointer(shader.aLocations.aTexCoord, 2, this.gl.FLOAT, false, vertexSize, 4 * 3);
    this.gl.vertexAttribPointer(shader.aLocations.aRotation, 1, this.gl.FLOAT, false, vertexSize, 4 * 5);
    this.gl.vertexAttribPointer(shader.aLocations.aColor, 4, this.gl.UNSIGNED_BYTE, true, vertexSize, 4 * 6);
    this.gl.vertexAttribPointer(shader.aLocations.aTPosition, 2, this.gl.FLOAT, false, vertexSize, 4 * 7);
    this.gl.vertexAttribPointer(shader.aLocations.aTOrigin, 2, this.gl.FLOAT, false, vertexSize, 4 * 9);
  };


  this.drawChar = function(spritefont,char,x,y,options){
    if (!(spritefont instanceof SpriteFont)) return;
      var opt = options || {};

      if (this.gl.activeShader !== this.gl.defaultFontShader) {
          this.gl.defaultFontShader.useProgram();
          if (opt.smoothing) {
            this.gl.defaultFontShader.setUniformf(opt.smoothing,this.gl.defaultFontShader.uLocations.uSmoothing);
          }
      }
      var sX = opt.scaleX || 1;
      var sY = opt.scaleY || 1;
      var c = opt.color || 0xffffffff;
      var originX = opt.originX || 0;
      var originY = opt.originY || 0;
      var rotation = opt.rotation || 0;
      var depth = opt.depth || 0;
      var outlineColor = opt.outlineColor || 0x00000000;
      var outlineColorFloats = [
        (outlineColor & 0xff) / 255,
        ((outlineColor & 0xff00) >> 8) / 255,
        ((outlineColor & 0xff0000) >> 16) / 255,
        ((outlineColor & 0xff000000) >>> 24) / 255
      ];

      var charInfo = spritefont.charInfo[string.charCodeAt(i)];

      var xSource = charInfo.x;
      var ySource = charInfo.y - charInfo.height;
      var widthSource = charInfo.width;
      var heightSource = charInfo.height;

      var xPos = x;
      var yPos = y - (charInfo.yoffset + charInfo.height) * texture.originalHeight * sY;

      var texture = spritefont.texture;
      this.gl.defaultFontShader.setUniform4f(outlineColorFloats,this.gl.defaultFontShader.uLocations.uOutlineColor);
      this.drawTexture(texture,new Rect(xSource,ySource,widthSource,heightSource),new Rect(xPos,yPos,widthSource * texture.originalWidth * sX,heightSource * texture.originalHeight * sY),rotation,c,depth,originX - xAdvance,originX,false,true);

  };

  this.drawString = function(spritefont,string,x,y,options){
    var opt = options || {};
    if (this.gl.activeShader !== this.gl.defaultFontShader) {
        this.gl.defaultFontShader.useProgram();
        if (opt.smoothing) {
          this.gl.defaultFontShader.setUniformf(opt.smoothing,this.gl.defaultFontShader.uLocations.uSmoothing);
        }
    }
    var sX = opt.scaleX || 1;
    var sY = opt.scaleY || 1;
    var c = opt.color || 0xffffffff;
    var originX = opt.originX || 0;
    var originY = opt.originY || 0;
    var rotation = opt.rotation || 0;
    var texture = spritefont.texture;
    var depth = opt.depth || 0;
    var outlineColor = opt.outlineColor || 0x00000000;

    var outlineColorFloats = [
      (outlineColor & 0xff) / 255,
      ((outlineColor & 0xff00) >> 8) / 255,
      ((outlineColor & 0xff0000) >> 16) / 255,
      ((outlineColor & 0xff000000) >>> 24) / 255
    ];

    var xAdvance = 0;
    this.gl.defaultFontShader.setUniform4f(outlineColorFloats,this.gl.defaultFontShader.uLocations.uOutlineColor);
    for (var i = 0; i < string.length; i++) {
      var charInfo = spritefont.charInfo[string.charCodeAt(i)];

      var xSource = charInfo.x;
      var ySource = charInfo.y - charInfo.height;
      var widthSource = charInfo.width;
      var heightSource = charInfo.height;

      var xPos = x + xAdvance;
      var yPos = y - (charInfo.yoffset + charInfo.height) * texture.height * sY;


      this.drawTexture(texture,new Rect(xSource,ySource,widthSource,heightSource),new Rect(xPos,yPos,widthSource * texture.width * sX,heightSource * texture.height * sY),rotation,c,depth,originX - xAdvance,originX,false,true);
      xAdvance += charInfo.xadvance * sX;
    }
  };

  this.drawLine = function(x,y,x2,y2,options){
    var opt = options || {};
    var depth = opt.depth || 0;
    var rotation = opt.rotation || 0;
    var color = opt.color || 0xffffffff;
    var originX = opt.originX || 0;
    var originY = opt.originY || 0;
    var thickness = opt.thickness || 1;

    var normal = new Vec2(y2 - y, -(x2 - x)).normalize().multiplyScalar(thickness);
    var index = 0;

    this._vertexData[index++] = x + normal.x;
    this._vertexData[index++] = y + normal.y;
    this._vertexData[index++] = depth;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = rotation;
    this._vertexColors[index++] = color;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = originX;
    this._vertexData[index++] = originY;

    this._vertexData[index++] = x2 + normal.x;
    this._vertexData[index++] = y2 + normal.y;
    this._vertexData[index++] = depth;
    this._vertexData[index++] = 1;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = rotation;
    this._vertexColors[index++] = color;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = originX;
    this._vertexData[index++] = originY;

    this._vertexData[index++] = x2 - normal.x;
    this._vertexData[index++] = y2 - normal.y;
    this._vertexData[index++] = depth;
    this._vertexData[index++] = 1;
    this._vertexData[index++] = 1;
    this._vertexData[index++] = rotation;
    this._vertexColors[index++] = color;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = originX;
    this._vertexData[index++] = originY;

    this._vertexData[index++] = x - normal.x;
    this._vertexData[index++] = y - normal.y;
    this._vertexData[index++] = depth;
    this._vertexData[index++] = 1;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = rotation;
    this._vertexColors[index++] = color;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = 0;
    this._vertexData[index++] = originX;
    this._vertexData[index++] = originY;

    this._render();
  };

  // this.drawLine = function(x,y,x2,y2,options){

  this.drawRect = function(rect,options){
      if (rect instanceof Rect) {
        var x1 = rect.x;
        var y1 = rect.y;
        var x2 = rect.x + rect.width;
        var y2 = rect.y + rect.height;
        var thickness = (options ? options.thickness | 1 : 1);
        this.drawLine(x1-thickness,y1,x2+ thickness,y1,options);
        this.drawLine(x2,y1-thickness,x2,y2+thickness,options);
        this.drawLine(x2+thickness,y2,x1-thickness,y2,options);
        this.drawLine(x1,y2+thickness,x1,y1-thickness,options);
      }else {
        throw 'rect must be instantiated to draw a rectangle';
      }

  };

  this.drawQuad = function(rect,options){
    var opt = options || {};
    opt.destinationRectangle = rect;
    this.DrawTexture(null,opt);
  };

  this.drawSprite = function(sprite) {
    this.draw(sprite,sprite.position.x, sprite.position.y, sprite.width, sprite.height, sprite.rotation, sprite.color, sprite.position.z,sprite.origin.x,sprite.origin.y,sprite.flipX);
  };

  this.draw = function(sprite, x, y, width, height, rotation, color, depth, originX, originY,flipX) {
    this.drawTexture(sprite.texture,null,new Rect(x,y,width,height),rotation,color,depth,originX,originY,flipX);
  };

  this.drawTexture = function(texture, sourceRect, destinationRect, rotation, color, depth, originX, originY,flipX,keepShader) {
    var options = {
      sourceRectangle: sourceRect,
      destinationRectangle: destinationRect,
      'rotation': rotation,
      'color': color,
      'depth': depth,
      'originX': originX,
      'originY': originY,
      'flipX':flipX,
      'keepShader': keepShader
    };
    this.DrawTexture(texture,options);
  };

  this._render = function(texture) {
    var shader = this.gl.activeShader;
    if (texture) {
      shader.setUniformi(true, shader.uLocations.useTexturing);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture.id);
    }else {
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      shader.setUniformi(false, shader.uLocations.uSampler);
      shader.setUniformi(false, shader.uLocations.useTexturing);
    }

    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this._bufferData);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);


  };
}

/**
 * Draw a texture with given options
 * @param {Texture} texture Texture to draw with
 * @param {object} options Drawing options:
 *  @param {Rect} sourceRectangle Source cordinates from 0 to 1
 *  @param {Rect} destinationRectangle Destination cordinates with set x,y,width,height
 *  @param {float} rotation Texture rotation in degrees
 *  @param {float} depth Z-index giving the order of drawing
 *  @param {float} originX Point of the origin to rotate around on the X-Axis
 *  @param {float} originY Point of the origin to rotate around on the Y-Axis
 *  @param {boolean} flipX Set to flip the texture coordinates horizontaly
 *  @param {boolean} keepShader Set to deny changing to the default shader.
 */
SpriteBatch.prototype.DrawTexture = function(texture, options) {
  if (!options.destinationRectangle) {
    console.error('no destination rectangle specified while drawing texture');
    return;
  }
  if (!options.keepShader) {
    this.gl.defaultShader.useProgram();
  }
  var index = 0;
  var sourceRect = options.sourceRectangle || new Rect(0,0,1,1);
  var destinationRect = options.destinationRectangle;
  var rotation = options.rotation || 0;
  var color = options.color || 0xffffffff;
  var depth = options.depth || 0;
  var originX = options.originX || 0;
  var originY = options.originY || 0;
  var flipX = options.flipX || false;

  var uVx0;
  var uVy0;
  var uVx1;
  var uVy1;
  var uVx2;
  var uVy2;
  var uVx3;
  var uVy3;

  if (flipX) {
    uVx0 = sourceRect.x + sourceRect.width;
    uVy0 = sourceRect.y;
    uVx1 = sourceRect.x;
    uVy1 = sourceRect.y;
    uVx2 = sourceRect.x;
    uVy2 = sourceRect.y + sourceRect.height;
    uVx3 = sourceRect.x + sourceRect.width;
    uVy3 = sourceRect.y + sourceRect.height;
  }else {
    uVx0 = sourceRect.x;
    uVy0 = sourceRect.y;
    uVx1 = sourceRect.x + sourceRect.width;
    uVy1 = sourceRect.y;
    uVx2 = sourceRect.x + sourceRect.width;
    uVy2 = sourceRect.y + sourceRect.height;
    uVx3 = sourceRect.x;
    uVy3 = sourceRect.y + sourceRect.height;
  }
  this._vertexData[index++] = 0;
  this._vertexData[index++] = 0;
  this._vertexData[index++] = depth;
  this._vertexData[index++] = uVx0;
  this._vertexData[index++] = uVy0;
  this._vertexData[index++] = rotation;
  this._vertexColors[index++] = color;
  this._vertexData[index++] = destinationRect.x;
  this._vertexData[index++] = destinationRect.y;
  this._vertexData[index++] = originX;
  this._vertexData[index++] = originY;

  this._vertexData[index++] = destinationRect.width;
  this._vertexData[index++] = 0;
  this._vertexData[index++] = depth;
  this._vertexData[index++] = uVx1;
  this._vertexData[index++] = uVy1;
  this._vertexData[index++] = rotation;
  this._vertexColors[index++] = color;
  this._vertexData[index++] = destinationRect.x;
  this._vertexData[index++] = destinationRect.y;
  this._vertexData[index++] = originX;
  this._vertexData[index++] = originY;

  this._vertexData[index++] = destinationRect.width;
  this._vertexData[index++] = destinationRect.height;
  this._vertexData[index++] = depth;
  this._vertexData[index++] = uVx2;
  this._vertexData[index++] = uVy2;
  this._vertexData[index++] = rotation;
  this._vertexColors[index++] = color;
  this._vertexData[index++] = destinationRect.x;
  this._vertexData[index++] = destinationRect.y;
  this._vertexData[index++] = originX;
  this._vertexData[index++] = originY;

  this._vertexData[index++] = 0;
  this._vertexData[index++] = destinationRect.height;
  this._vertexData[index++] = depth;
  this._vertexData[index++] = uVx3;
  this._vertexData[index++] = uVy3;
  this._vertexData[index++] = rotation;
  this._vertexColors[index++] = color;
  this._vertexData[index++] = destinationRect.x;
  this._vertexData[index++] = destinationRect.y;
  this._vertexData[index++] = originX;
  this._vertexData[index++] = originY;

  this._render(texture);
};

/**
 * Ends the current Batch - reseting uniforms,disabling buffers and attributes
 */
SpriteBatch.prototype.End = function(){
  var shader = this.gl.activeShader;

  shader.setUniformi(false, shader.uLocations.useTexturing);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  this.gl.disableVertexAttribArray(shader.aLocations.aPosition);
  this.gl.disableVertexAttribArray(shader.aLocations.aTexCoord);
  this.gl.disableVertexAttribArray(shader.aLocations.aRotation);
  this.gl.disableVertexAttribArray(shader.aLocations.aColor);
};

SpriteBatch.prototype.Release = function(){
  this.gl.deleteBuffer(this.VertexDataBuffer);
  this.gl.deleteBuffer(this.IndexBuffer);
  this.bufferData.clear();
};
