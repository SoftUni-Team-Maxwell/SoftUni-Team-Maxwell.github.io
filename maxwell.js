/* ============================================= GAME OBJECTS ============================================= */
/* --------------- Camera ---------------*/

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

/* --------------- Camera end ---------------*/


/* --------------- Pickup ---------------*/

function Pickup(x,y,width,height,texture,type){
  this.boundingBox = new Rect(x,y,width,height);
  this.texture = texture;
  this.type = type;
  this.active = true;
  this.pickedUp = false;
  this.lifeTime = 35;

}

Pickup.prototype = {
  constructor : Pickup,
  get x() { return this.boundingBox.x;},
  set x(value) {
    if (isNaN(value)) {
      return;
    }
     this.boundingBox.x = value;
   },
  get y() { return this.boundingBox.y;},
  set y(value) {
    if (isNaN(value)) {
      return;
    }
    this.boundingBox.y = value;
  },
  get width() {
    return this.boundingBox.width;
  },
  get height() {
    return this.boundingBox.height;
  },
  get BoundingBox(){
    return this.boundingBox;
  },
  CheckCollision : function(rect,shrink){
    if (this.pickedUp) {
      return false;
    }
    var result = AARectColiding(this.boundingBox,rect,shrink);
    if (result === true) {
      this.pickedUp = true;
    }
    return result;
  },
  getTypeInfo : function(){
    switch (this.type.toLowerCase()) {
      case 'banana':
        return {points: 50, fill: 5};
      case 'carrot':
        return {points: 35, fill: 3};
      case 'grapes':
        return {points: 75, fill: 7};
      case 'orange':
        return {points: 65, fill: 6};
      case 'tomato':
        return {points: 45, fill: 4};
      default:
        return {points: 25, fill: 2};
    }
  },
};

function pickupType(index){
  switch(index){
    case 0:
      return 'banana';
    case 1:
      return 'cherries';
    case 2:
      return 'carrot';
    case 3:
      return 'grapes';
    case 4:
      return 'orange';
    case 5:
      return 'tomato';
  }
}

/* --------------- Pickup end ---------------*/


/* --------------- Trap ---------------*/
function Trap(x,texture,type){
    this.boundingBox = this.GenerateBoundingBox(x,type);
    this.texture = texture;
    this.type = type;
    this.onScreen = true;
    this.hit = false;
    this.lifeTime = 35;
}

Trap.prototype = {
    constructor : Trap,
    get x() { return this.boundingBox.x;},
    set x(value) {
        if (isNaN(value)) {
            return;
        }
        this.boundingBox.x = value;
    },
    get y() { return this.boundingBox.y;},
    set y(value) {
        if (isNaN(value)) {
            return;
        }
        this.boundingBox.y = value;
    },
    get width() {
        return this.boundingBox.width;
    },
    get height() {
        return this.boundingBox.height;
    },
    get BoundingBox(){
        return this.boundingBox;
    },
    CheckCollision : function(rect,shrink){

        var result = AARectColiding(this.boundingBox,rect,shrink);
        if (result === true) {
            //console.log("TRAP HITTT");
        }
        return result;
    },
    GenerateBoundingBox : function(x,type) {
        var currentY = this.GenerateY(type);
        if(type ==='line'){
            return new Rect(x, currentY, 100, 100);
        }
        return new Rect(x, currentY, 250, 250);

    },
    GenerateY : function(type){
        if(type ==='line'){
            var random = Math.floor(Math.random() * 2);
            if(random===1){
                return 540;
            }
            return 80;
        }
        else{
            return Math.floor(Math.random() * 250)+150;
        }
    },

};
/* --------------- Trap end ---------------*/


/* ============================================= Graphics ============================================= */

/* --------------- Particle ---------------*/

function Particle(x,y,width,height,vec2direction,life,color){
  this.position = new Vec2(x,y);
  this.width = width;
  this.height = height;
  this.direction = vec2direction;
  this.life = life;
  this.color = color || 0xffffffff;
}

Particle.prototype  = {
  constructor: Particle,
  Update : function(delta){
    if (--this.life < 0) {
      return;
    }
    delta = delta || 1;
    var dir = this.direction.multiplyScalarCopy(delta);
    this.position.add(dir);
  }
};

/* --------------- Particle end ---------------*/


/* --------------- Particle Engine ---------------*/
function ParticleEngine(glContext,texture,maxCount){
  this.gl = glContext;
  this.texture = texture;

  this.minWidth = 1;
  this.maxWidth = 2;
  this.minHeight = 1;
  this.maxHeight = 2;
  this.maxCount = maxCount;
  this.depth = 0;
  this.life = 10;
  this.particles = [];


  this.generationMethod = null;
  this.updateMethod = null;

  ParticleEngine.prototype.Generate = function(x,y){
    if (this.particles.length > this.maxCount) return false;
    var _x,_y;

    if (x instanceof Vec2) {
      _x = x.x;
      _y = x.y;
    }else {
      _x = x;
      _y = y;
    }

    if (this.generationMethod) {
      return this.generationMethod(_x,_y);
    }else {
      var particles = this.particles;
      var count = this.maxCount;

      var width = getRandomInt(this.minWidth,this.maxWidth);
      var dirX = getRandomInt(-100,100) / 100.0;
      var dirY = getRandomInt(-100,100) / 100.0;
      var directionNormalized = new Vec2(dirX,dirY);
      directionNormalized.normalize();

      //function Particle(x,y,width,height,vec2direction,life,color){

      var p = new Particle(_x,_y,width,width,directionNormalized,this.life);
      particles.push(p);
      return true;
    }
  };

  ParticleEngine.prototype.Update = function(delta){
    for (var i = 0; i < this.particles.length; i++) {

      this.particles[i].Update(delta);
      if(this.particles[i].life <= 0){
        this.particles.splice(i,1);
        i--;
      }
    }
  };

  ParticleEngine.prototype.draw = function(batch){
    var p = this.particles;
    for (var i = 0; i < p.length; i++) {
      //texture, sourceRect, destinationRect, rotation, color, depth, originX, originY,flipX
      batch.drawTexture(this.texture,null,new Rect(p[i].position.x,p[i].position.y,p[i].width,p[i].height),this.depth,p[i].color,15);
    }
  };

}
/* --------------- Particle Engine end ---------------*/


/* --------------- Quad ---------------*/
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
/* --------------- Quad end ---------------*/


/* --------------- Shader Program ---------------*/
// NOTE(Inspix): Currently is used mainly for the standard shader.
// TODO(Inspix): Make it a bit more modular.
function ShaderProgram(gl, vsSource, fsSource) {
  this.glContext = gl;
  var makeDefault = false;
  if (!vsSource) {
    vsSource =  document.getElementById('vshader').textContent;  //String(defaultVS);
    console.log('No Vertex Shader source supplied, creating default program');
    makeDefault = true;
  }
  if (!fsSource) {
    fsSource = document.getElementById('fshader').textContent; //String(defaultFS);
    console.log('No Fragment Shader source supplied, creating default program');
    makeDefault = true;
  }
  this.vsSource = vsSource;
  this.fsSource = fsSource;
  // TODO(Inspix): Add more uniform setters

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw 'VertexShader compilation error ' + gl.getShaderInfoLog(vertexShader);
  }
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw 'FragmentShader compilation error ' + gl.getShaderInfoLog(fragmentShader);
  }


  this.id = gl.createProgram();
  gl.attachShader(this.id, vertexShader);
  gl.attachShader(this.id, fragmentShader);
  gl.linkProgram(this.id);

  if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(this.id);
  }else {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }
  this.aLocations = {};
  this.uLocations = {};
  this.aLocations.aPosition = gl.getAttribLocation(this.id, 'aPosition');
  this.aLocations.aTexCoord = gl.getAttribLocation(this.id, 'aTexCoord');
  this.aLocations.aColor = gl.getAttribLocation(this.id, 'aColor');
  this.aLocations.aRotation = gl.getAttribLocation(this.id, 'aRotation');
  this.aLocations.aTPosition = gl.getAttribLocation(this.id, 'aTPosition');
  this.aLocations.aTOrigin = gl.getAttribLocation(this.id, 'aTOrigin');
  this.aLocations.aTid = gl.getAttribLocation(this.id, 'aTid');
  this.uLocations.uPrMatrix = gl.getUniformLocation(this.id, 'uPrMatrix');
  this.uLocations.uVwMatrix = gl.getUniformLocation(this.id, 'uVwMatrix');
  this.uLocations.uModelMatrix = gl.getUniformLocation(this.id, 'uModelMatrix');
  this.uLocations.uSampler = gl.getUniformLocation(this.id, 'uSampler');
  this.uLocations.uFade = gl.getUniformLocation(this.id, 'uFade');
  this.uLocations.useTexturing = gl.getUniformLocation(this.id, 'useTexturing');
  if (!makeDefault) {
    this.uLocations.uSmoothing = gl.getUniformLocation(this.id,'uSmoothing');
    this.uLocations.uOutlineColor = gl.getUniformLocation(this.id, 'uOutlineColor');
  }

  var identity = new Mat4(1);
  this.glContext.activeShader = this;
  this.setUniformMat4(identity, this.uLocations.uPrMatrix);
  this.setUniformMat4(identity, this.uLocations.uVwMatrix);
  this.setUniformMat4(identity, this.uLocations.uModelMatrix);
  this.setUniformf(1, this.uLocations.uFade);
}

ShaderProgram.prototype = {
  constructor : ShaderProgram,
  setUniformf : function(value, loc) {
      this.useProgram();
      this.glContext.uniform1f(loc, value);
  },
  setUniformi : function(value, loc) {
      this.useProgram();
      this.glContext.uniform1i(loc, value);
  },
  setUniform2f : function(value, loc) {
      this.useProgram();
      this.glContext.uniform2f(loc, value.x,value.y);
  },
  setUniform4f : function(value, loc) {
      this.useProgram();
      this.glContext.uniform4f(loc, value[0],value[1],value[2],value[3]);
  },
  setUniformMat4 : function(mat4, loc) {
    if (mat4 instanceof Mat4) {
      this.useProgram();
      this.glContext.uniformMatrix4fv(loc, false, mat4.values);
    }
  },
  useProgram : function() {
    if (this.glContext.activeShader !== this) {
      if (this.glContext.activeShader) {
        this.glContext.activeShader.unuseProgram();
      }
      this.glContext.useProgram(this.id);
      this.glContext.activeShader = this;
    } else {
      if (!this.isInUse) {
        this.glContext.useProgram(this.id);
        this.isInUse = true;
        this.glContext.activeShader = this;

      }
    }
  },
  unuseProgram : function() {
    if (this.glContext.activeShader === this) {
      this.glContext.useProgram(null);
      this.isInUse = false;
      this.glContext.activeShader = null;
    }
  }
};
/* --------------- Shader Program end ---------------*/


/* --------------- Sprite ---------------*/
function Sprite(vec3Pos, vec2size, texture) {
  this.texture = texture;

  // NOTE(Inspix): Sprite transformation variables.
  this.width = vec2size.x || 1;
  this.height = vec2size.y || 1;
  this.position = vec3Pos || new Vec3(0, 0, 0);
  this.color = 0xffffffff;
  this.rotation = 0;
  this.scale = new Vec3(1, 1, 1);
  this.origin = new Vec2(0,0);

  // TODO: Create getters/setters where needed.

}
/* --------------- Sprite end ---------------*/



/* --------------- SpriteBatch ---------------*/
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
/* --------------- SpriteBatch end ---------------*/



/* --------------- SpriteFont ---------------*/
function SpriteFont(glContext, filePath) {
  this.gl = glContext;
  this.initialized = false;
  this.charInfo = {};
  this.texture = null;
  this.filePath = filePath;
}

SpriteFont.prototype.MeasureString = function(string) {
  var result = new Vec2(0, 0);

  for (var i = 0; i < string.length; i++) {
    var c = this.charInfo[string.charCodeAt(i)];

    var heightOutput = c.height * this.texture.originalHeight;
    if (i < string.length - 1) {
      result.x += c.xadvance;
    }
    if (result.y < heightOutput) {
      result.y = heightOutput;
    }
  }
  return result;
};

SpriteFont.prototype.Init = function(){
  var self = this;
  var image = new Image();
  image.src = this.filePath.replace('fnt', 'png');
  image.onload = function() {
    self.texture = new Texture(self.gl, this);

    readFile(self.filePath, function(data) {
      var text = data.split('\n');
      var regex = /([0-9\.\-]+)/g;
      for (var i = 1; i < text.length; i++) {
        var info = {};
        var index = 0;
        // TODO(Inspix): Add kernings to the calculation.
        while ((matches = regex.exec(text[i])) !== null) {
          var value = parseInt(matches[1]);
          if (index === 2) {
            value = image.naturalHeight - value;
          }
          if (!(index === 0 || index === 7)) {
            value /= image.naturalWidth;
          }

          info[getCharInfoProperty(index++)] = value;
        }
        self.charInfo[info.char] = info;
      }
      if (self.onLoad) {
        self.onLoad();
      }
      self.initialized = true;
    });
  };
};

SpriteFont.prototype.onLoad = null;

SpriteFont.prototype.Release = function(){
  this.texture.Release();
  this.charInfo = {};
};

function getCharInfoProperty(index) {
  switch (index) {
    case 0:
      return 'char';
    case 1:
      return 'x';
    case 2:
      return 'y';
    case 3:
      return 'width';
    case 4:
      return 'height';
    case 5:
      return 'xoffset';
    case 6:
      return 'yoffset';
    case 7:
      return 'xadvance';
    default:
      return 'unknown';
  }
}

function readFile(filePath, callback) {
  var req;

  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else {
    req = new ActiveXObject("Microsoft.XMLHTTP");
  }

  req.onreadystatechange = function() {
    if (this.readyState == 4) {
      var lines = this.responseText;
      callback(this.responseText);
    }
  };
  req.open("GET", filePath, true);
  req.send();
}
/* --------------- SpriteFont end ---------------*/


/* --------------- Texture ---------------*/
function Texture(glContext, image){
  this.gl = glContext;
  this._id = glContext.createTexture();
  this._originalWidth = image.naturalWidth;
  this._originalHeight = image.naturalHeight;
  this.gl.bindTexture(this.gl.TEXTURE_2D, this._id);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,true);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE,image);

}

Texture.prototype = {
  get id() { return this._id; },
  get width() {return this._originalWidth;},
  get height() { return this._originalHeight;},
  Release : function(){
    this.gl.deleteTexture(this._id);
  }
};
/* --------------- Texture end ---------------*/



/* --------------- WebGl UTILS ---------------*/
function initWebGL(canvas){
  var gl = canvas.getContext('webgl',{antialias: true});

  if (!gl) {
    throw 'Crap no WebGL context available';
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.blendEquation(gl.FUNC_ADD);
  gl.depthFunc(gl.LEQUAL);
  // TODO(Inspix): Add alpfa blending.

  gl.defaultShader = new ShaderProgram(gl);
  var vertexSource = document.getElementById('vshader').textContent;
  var fragmentSource = document.getElementById('fontFshader').textContent;
  gl.defaultFontShader = new ShaderProgram(gl,vertexSource,fragmentSource);
  gl.defaultFontShader.setUniformf(0.1,gl.defaultFontShader.uLocations.uSmoothing);

  return gl;
}
/* --------------- WebGl UTILS end ---------------*/


/* ============================== ASSETMANAGER ============================= */
function AssetManager(glContext){
  this.gl = glContext;
  this.images = [];
  this.textures = {};
  this.sounds = {};
  this.songs = {};
  this.sprites = {};
  this.fonts = {};
  this.queue = {
    textures: [],
    sprites : [],
    sounds : [],
    songs : [],
    fonts : [],
  };
  this.loaded = 0;
  this.total = 0;
  this.songGain = AUDIO.createGain();
  this.soundGain = AUDIO.createGain();
  this._songVolume = 1;
  this._soundVolume = 1;
}

AssetManager.prototype = {
  constructor: AssetManager,
  get SoundVolume() {return this._soundVolume;},
  set SoundVolume(value) {
    if (isNaN(value)) {
      return;
    }
    var v = clamp(value,0,1);
    this._soundVolume = v;
    this.soundGain.gain.value = v;
  },
  get SongVolume() {return this._songVolume;},
  set SongVolume(value) {
    if (isNaN(value)) {
      return;
    }
    var v = clamp(value,0,1);
    this._songVolume = v;
    this.songGain.gain.value = v;
  },
  AddTexture: function(id,texture){
    this.textures[id] = texture;
  },
  AddSound: function(id,sound){
    this.sounds[id] = sound;
  },
  AddSong: function(id,song){
    this.songs[id] = song;
  },
  AddSprite: function(id,sprite){
    this.sprites[id] = sprite;
  },
  AddFont: function(id,font){
    this.sprites[id] = font;
  },
  QueueToLoadTexture: function(id,imageUrl){
    this.queue.textures.push({'id' : id, url : imageUrl});
  },
  QueueToLoadSound: function(id,soundUrl){
    this.queue.sounds.push({'id' : id, url : soundUrl});
  },
  QueueToLoadSong: function(id,songUrl){
    this.queue.songs.push({'id' : id, url : songUrl});
  },
  QueueToLoadSprite: function(id,textureId,options){
    this.queue.sprites.push({'id' : id, texId:textureId,'options' : options});
  },
  QueueToLoadFont: function(id,fontUrl){
    this.queue.fonts.push({'id':id,url:fontUrl});
  },
  Load : function(onFinish){


    var q = this.queue;
    this.total = q.textures.length + q.songs.length + q.sounds.length + q.fonts.length + q.sprites.length;
    this.loaded = 0;
    for (var i = 0; i < q.textures.length; i++) {
      var item = q.textures[i];
      this.LoadImage(i, item);
    }
    for (var s = 0; s < q.sounds.length; s++) {
        var sound = q.sounds[s];
        this.LoadSound(sound);
    }
    for (var snd = 0; snd < q.songs.length; snd++) {
        var song = q.songs[snd];
        this.LoadSong(song);
    }
    for (var sp = 0; sp < q.sprites.length; sp++) {
      var sprite = q.sprites[sp];
      //function Sprite(gl, vec3Pos, vec2size, texture, texCoords, colors) {
      var position = sprite.options.position || new Vec3(0,0,0);
      var size = sprite.options.size || new Vec2(100,100);
      this.sprites[sprite.id] = new Sprite(position,size,this.textures[sprite.textureId]);
      this.loaded++;
      this.onProgressUpdate(100*(this.loaded/this.total),'sprites/' + sprite.id);
      if (this.isLoaded()) {
        if (this.onLoad) {
          this.onLoad();
        }
      }
    }
    for (var f = 0; f < q.fonts.length; f++) {
      var font = q.fonts[f];
      this.LoadFont(font);

    }
  },
  ReleaseTexture: function(id,texture){
    this.textures[id].Release();
  },
  ReleaseSound: function(id,sound){
    this.sounds[id].Release();
  },
  ReleaseSong: function(id,song){
    this.song[id].Release();
  },
  ReleaseSprite: function(id,sprite){
    this.sprites[id] = sprite;
  },
  ReleaseFont: function(id,font){
    this.sprites[id].Release();
  },
  onProgressUpdate : function(percent,msg){
    throw 'not implemented';
  },
  LoadImage : function(index,item){
    var self = this;
    var img = new Image();
    img.onload = function(){
      self.textures[item.id] = new Texture(GL,img);
      self.loaded++;
      self.onProgressUpdate(100*(self.loaded/self.total),'textures/'+item.id);
      if (self.isLoaded()) {
        if (self.onLoad) {
          self.onLoad();
        }
      }
    };
    img.src = item.url;
  },
  LoadFont : function(font){
    var self = this;
    var current = new SpriteFont(GL,font.url);
    current.onLoad = function(){
      self.loaded++;
      self.onProgressUpdate(100*(self.loaded/self.total),'fonts/' + font.id);
      self.fonts[font.id] = current;
      if (self.isLoaded()) {
        if (self.onLoad) {
          self.onLoad();
        }
      }
    };
    current.Init();
  },
  LoadSound : function(sound){
    this.LoadAudio(sound,false);
  },
  LoadSong : function(song){
    this.LoadAudio(song,true);
  },
  LoadAudio : function(item,song){
    var request = new XMLHttpRequest();
    request.open('GET', item.url, true);
    request.responseType = 'arraybuffer';
    var self = this;
    request.onload = function() {
      AUDIO.decodeAudioData(request.response, function(buffer) {
        if (song) {
          self.songs[item.id] = buffer;
        }else {
          self.sounds[item.id] = buffer;
        }
        self.loaded++;
        self.onProgressUpdate(100*(self.loaded/self.total),'sounds/' + item.id);
        if (self.isLoaded()) {
          if (self.onLoad) {
            self.onLoad();
          }
        }
      }, function(error){
        console.log(error);
      });
    };
    request.send();
  },
  onLoad : null,
  isLoaded : function isLoaded(){
    if (this.total <= this.loaded) {
      return true;
    }
    return false;
  },
  PlaySound: function(sound){
    var buffer = this.sounds[sound];
    if (!buffer) {
      return;
    }
    var source = AUDIO.createBufferSource();
    source.buffer = buffer;
    source.connect(this.soundGain);
    this.soundGain.gain.value = this.SoundVolume;
    this.soundGain.connect(AUDIO.destination);
    source.start(0);
  },
  PlaySong: function(song,loop,fadeOut,fadeIn){
    if (this.fadeInInterval) {
      return;
    }
    var self = this;

    if (self.currentSong) {
      var next = {
        id : song,
        'loop' : loop,
        'fadeIn' : fadeIn
      };
      self.StopCurrentSong(fadeOut,next);
      return;
    }
    var buffer = self.songs[song];
    if (!buffer) {
      return;
    }
    if (fadeIn) {
      self.songGain.gain.value = 0;
      var interval = fadeIn/50;
      self.fadeInInterval = setInterval(function(){
        self.songGain.gain.value += self.SongVolume / interval;
        if (self.songGain.gain.value >= self.SongVolume) {
          clearInterval(self.fadeInInterval);
          self.fadeInInterval = null;
        }
      },50);
    } else {
      self.songGain.gain.value = self.SongVolume;
    }
    self.currentSong = AUDIO.createBufferSource();
    self.currentSong.buffer = buffer;
    self.currentSong.connect(self.songGain);
    self.songGain.connect(AUDIO.destination);
    self.currentSong.start(0);
    self.currentSong.loop = loop;
  },
  StopCurrentSong : function(fade,next){
    if (this.songInterval) {
      return;
    }
    var self = this;
    if (self.currentSong) {
      if (fade) {
        var intervals = fade / 50;
        self.songInterval = setInterval(function(){
          self.songGain.gain.value -= 1 / intervals;
          if (self.songGain.gain.value <= 0) {
            clearInterval(self.songInterval);
            self.currentSong.stop();
            self.currentSong = null;
            self.songInterval = null;
            if (next) {
              self.PlaySong(next.id,next.loop,null,next.fadeIn);
            }
          }
        },50);
      }else {
        self.currentSong.stop();
        self.currentSong = null;
      }
    }
  }
};

/* ===================================== MATH =====================================*/
/* --------------- Matrix 4x4 ---------------*/
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

/* --------------- Matrix 4x4 end ---------------*/


/* --------------- Rectangle ---------------*/
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

/* --------------- Rectangle end ---------------*/


/* --------------- Vec2 ---------------*/
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
/* --------------- Vec2 end ---------------*/


/* --------------- Vec3 ---------------*/
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
/* --------------- Vec3 end ---------------*/

/* =============================================== SCENE =============================================== */
/* --------------- Button ---------------*/
function Button(spriteNormal,spriteHover,spriteClick){
  this.Normal = spriteNormal;
  this.Hover = spriteHover;
  this.Click = spriteClick;
  this.boundingBox = new Rect(0,0,this.Normal.width,this.Normal.height);
  this.depth = 0;
  this.rotation = 0;
  this.originX = 0;
  this.originY = 0;
  this.hovered = false;
  this.clicked = false;
  this.currentState = this.Normal;
  this.Action = null;

}

Button.prototype = {
  constructor : Button,
  get x() { return this.boundingBox.x;},
  set x(value) {if (!isNaN(value)) {
    this.boundingBox.x = value;
  }},
  get y() { return this.boundingBox.y;},
  set y(value) {if (!isNaN(value)) {
    this.boundingBox.y = value;
  }},
  get width() { return this.boundingBox.width;},
  set width(value) {if (!isNaN(value)) {
    this.boundingBox.width = value;
  }},
  get height() { return this.boundingBox.height;},
  set height(value) {if (!isNaN(value)) {
    this.boundingBox.height = value;
  }},
  get position() { var result = new Vec3(this.boundingBox.x,this.boundingBox.y, this.boundingBox.depth); return result;},
  set position(vec3) {
    if (vec3 instanceof Vec3) {
      this.boundingBox.x = vec3.x;
      this.boundingBox.y = vec3.y;
      this.depth = vec3.z;
    }
  },
  Draw : function(batch){
    batch.drawTexture(this.currentState.texture,null,this.boundingBox,this.rotation,this.currentState.color,this.depth,this.originX,this.originY,false);
  },
  Hovered : function(x,y){
    this.hovered = this.boundingBox.ContainsPoint(x,y);
    if (this.hovered) {
      if (this.clicked) {
        this.currentState = this.Click;
      }else {
        this.currentState = this.Hover;
      }
    }else {
      this.currentState = this.Normal;
    }
    return this.hovered;
  },
  onClick : function(){
    if (this.hovered) {
      this.currentState = this.Click;
      if (this.Action) {
        this.Action();
      }
    }
  },
  onMouseDown : function(){
    if (this.hovered) {
      this.clicked = true;
    }
  },
  onMouseUp : function(){
    this.clicked = false;
    if (this.hovered && this.Action) {
      this.Action();
    }
  }
};
/* --------------- Button end ---------------*/


/* --------------- GamePlayScene ---------------*/
function GamePlayScene(glContext, canvas) {
  SceneNode.call(this, glContext);
  this.background = null;
  this.background2 = null;
  this.ground = null;
  this.ground2 = null;
  this.lava = null;
  this.playerSheet = null;
  this.tootParticles = null;
  this.canvas = canvas;
  this.hud = null;
  this.pickups = null;
  this.traps = null;
  this.pause = false;
  this.camera = new Camera(new Mat4(1));
  this.speed = 4;
  this.playback = false;

  var self = this;
  this.transition = new Transition(0, 500);
  this.transition.onUpdate = function(delta, percent) {
    self.gl.defaultShader.setUniformf(percent / 100, self.gl.defaultShader.uLocations.uFade);
    self.gl.defaultFontShader.setUniformf(percent / 100, self.gl.defaultFontShader.uLocations.uFade);
  };

  /*------------------- Private Logic -------------*/

  var accum = 0;
  var cooldown = 5;

  //jumping
  var minY = 80;
  var maxY = 540;
  var jumping = false;
  var falling = false;
  var mousePosition = new Vec2(0, 0);

  var playerOptions = {
    sourceRectangle: new Rect(0.75, 0.0, 0.25, 0.25),
    destinationRectangle: new Rect(100, minY, 100, 100),
    flipX: true
  };

  this.AddListener(CANVAS, 'mousemove', MousePosition);
  this.AddListener(CANVAS, 'mousedown', MouseDown);
  this.AddListener(CANVAS, 'mouseup', MouseUp);

  function MousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    mousePosition.x = e.clientX - rect.left;
    mousePosition.y = rect.bottom - e.clientY;
  }

  function MouseDown() {
    falling = false;
    jumping = true;
  }

  function MouseUp() {
    falling = true;
    jumping = false;
  }
  var loop = 1;
  this._updateSelf = function(delta) {
    // Test score
    this.camera.x += this.speed;
    playerOptions.destinationRectangle.x += this.speed;
    if (--cooldown < 0) {
      cooldown = 15 / this.speed;
      playerOptions.sourceRectangle.x -= 0.25;
      if (playerOptions.sourceRectangle.x < 0.0) {
        playerOptions.sourceRectangle.x = 0.75;

        playerOptions.sourceRectangle.y += 0.25;
        if (playerOptions.sourceRectangle.y >= 1.0) {
          playerOptions.sourceRectangle.y = 0.0;
        }
      }
    }

    if (this.camera.x >= CANVAS.width * loop) {
      loop++;
      this.background.position.x += CANVAS.width;
      this.background2.position.x += CANVAS.width;
      this.ground.position.x += canvas.width;
      this.ground2.position.x += canvas.width;
    }

    //Handle jumping
    if (jumping === true) {
      this.tootParticles.Generate(playerOptions.destinationRectangle.x, playerOptions.destinationRectangle.y + 20);

      if (playerOptions.destinationRectangle.y < maxY) {
        playerOptions.destinationRectangle.y += 7;
      } else {
        playerOptions.destinationRectangle.y = maxY;
      }
    } else if (falling) {
      if (playerOptions.destinationRectangle.y > minY) {
        playerOptions.destinationRectangle.y -= 7;
      } else {
        playerOptions.destinationRectangle.y = minY;
        falling = false;
      }
    }

    this.tootParticles.Update(3);
    this.hud.mousePosition = mousePosition;
    this.pickups.playerRect = playerOptions.destinationRectangle;
    this.traps.playerRect = playerOptions.destinationRectangle;


  };

  this._drawSelf = function(batch) {
    batch.drawSprite(this.background);
    batch.drawSprite(this.background2);
    batch.drawSprite(this.ground);
    batch.drawSprite(this.ground2);
    batch.DrawTexture(this.playerSheet, playerOptions);
    this.tootParticles.draw(batch);
  };
}

GamePlayScene.prototype = Object.create(SceneNode.prototype);

GamePlayScene.prototype.Init = function() {
  if (this.initialized) {
    return;
  }
  var gl = this.gl;
  var canvas = this.canvas;

  this.tootParticles = new ParticleEngine(gl, ASSETMANAGER.textures.bubble, 50);
  this.tootParticles.minWidth = 5;
  this.tootParticles.maxWidth = 25;
  this.tootParticles.depth = -1;
  this.tootParticles.life = 50;
  this.tootParticles.generationMethod = generateToots;


  this.background = new Sprite(new Vec3(0, 0, 0), new Vec2(canvas.width, canvas.height), ASSETMANAGER.textures.background);
  this.background2 = new Sprite(new Vec3(canvas.width, 0, 0), new Vec2(canvas.width, canvas.height), ASSETMANAGER.textures.background);
  this.ground = new Sprite(new Vec3(0, 0, 0), new Vec2(canvas.width, 100), ASSETMANAGER.textures.grass);
  this.ground2 = new Sprite(new Vec3(canvas.width, 0, 0), new Vec2(canvas.width, 100), ASSETMANAGER.textures.grass);
  this.lava = new Sprite(new Vec3(0, 0, 0), new Vec2(canvas.width, 100), ASSETMANAGER.textures.lava);
  this.playerSheet = ASSETMANAGER.textures.player;
  this.hud = new HudScene(gl);
  this.hud.Init();
  this.pickups = new PickupsScene(gl);
  this.pickups.Init();
  this.pickups.camera = this.camera;
  this.pickups.hud = this.hud;

  this.traps = new TrapScene(gl);
  this.traps.Init();
  this.traps.camera = this.camera;

  this.AddNode(this.hud);
  this.AddNode(this.pickups);
  this.AddNode(this.traps);
  this.initialized = true;
};


GamePlayScene.prototype.UpdateSelf = function(delta) {
  if (!this.transition.finished) {
    this.transition.Update(delta);
  }
  if (!this.playback) {
    this.transition.Start();
    this.playback = true;
    ASSETMANAGER.PlaySong('gameplay', true, 1000, 1000);
  }
  if (this.pause) {
    return;
  }
  this._updateSelf(delta);
};

GamePlayScene.prototype.DrawSelf = function(batch) {
  this.gl.defaultShader.setUniformMat4(this.camera.Matrix, this.gl.defaultShader.uLocations.uVwMatrix);
  this._drawSelf(batch);
  this.gl.defaultShader.setUniformMat4(Identity, this.gl.defaultShader.uLocations.uVwMatrix);

};

function generateToots(x, y) {
  if (this.particles.length > this.maxCount) {
    return false;
  }
  var _x, _y;

  if (x instanceof Vec2) {
    _x = x.x;
    _y = x.y;
  } else {
    _x = x;
    _y = y;
  }


  var particles = this.particles;
  var count = this.maxCount;

  var width = getRandomInt(this.minWidth, this.maxWidth);
  var dirX = getRandomInt(-25, 0) / 100.0;
  var dirY = getRandomInt(-100, 0) / 100.0;
  var directionNormalized = new Vec2(dirX, dirY);
  directionNormalized.normalize();
  var colorR = getRandomInt(0, 255);
  var colorG = getRandomInt(0, 255);
  var colorB = getRandomInt(0, 255);
  var colorA = 175;

  var color = (colorA << 24) | (colorB << 16) | (colorG << 8) | colorR;

  var p = new Particle(_x, _y, width, width, directionNormalized, this.life, color);
  particles.push(p);
  return true;
}
/* --------------- GamePlayScene end ---------------*/



/* --------------- HudScene ---------------*/
function HudScene(glContext){
  SceneNode.call(this,glContext);
  var self = this;
  this.score = 0;
  this.optionsButton = null;
  this.pauseButton = null;
  this.mousePosition = null;
  this.font = null;
  this.pausedFont = null;
  this.fontOptions = {
    scaleX : 0.55,
    scaleY : 0.55,
    color : 0xff000000,
    depth: 99,
    outlineColor : 0xffffffff,
    smoothing : 0.05
  };
  this.pauseOptions = {
    scaleX:1.25,
    scaleY:1.25,
    color: 0x00111111,
    depth: 99,
    outlineColor: 0x00dd9933,
    smoothing: 0.2
  };
  this.paused = false;
  this.transitionFadeIn = new Transition(0,500);
  this.transitionFadeOut = new Transition(0,500);

  this.transitionFadeIn.onUpdate = function(delta,percent){
    var amount = (percent / 100 * 255) | 0;
    if (100 - percent > 50) {
      self.gl.defaultShader.setUniformf((100 - percent)/ 100, self.gl.defaultShader.uLocations.uFade);
    }
    self.pauseOptions.color = setChannel(self.pauseOptions.color,'a',amount);
    self.pauseOptions.outlineColor = setChannel(self.pauseOptions.outlineColor,'a',amount);
  };

  this.transitionFadeOut.onUpdate = function(delta,percent){
    var amount = ((100 - percent) / 100 * 255) | 0;
    if (percent > 50) {
      self.gl.defaultShader.setUniformf(percent/ 100, self.gl.defaultShader.uLocations.uFade);
    }
    self.pauseOptions.color = setChannel(self.pauseOptions.color,'a',amount);
    self.pauseOptions.outlineColor = setChannel(self.pauseOptions.outlineColor,'a',amount);
  };

  this.transitionFadeIn.onFinish = transitionFinish;
  this.transitionFadeOut.onFinish = transitionFinish;


  function transitionFinish(){
    console.log('Tran sition finish');
    this.transitioning = false;
  }
}

HudScene.prototype = Object.create(SceneNode.prototype);

HudScene.prototype.Init = function(){
  if (this.initialized) {
    return;
  }
  var self = this;
  var normal = new Sprite(new Vec3(0,0,-100),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  normal.color = 0xaaaaaaaa;
  var hover = new Sprite(new Vec3(0,0,-100),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  hover.color = 0xffffffff;
  var click = new Sprite(new Vec3(0,0,-100),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  click.color = 0xffaaaaaa;
  this.font = ASSETMANAGER.fonts.default;
  this.pausedFont = ASSETMANAGER.fonts.cooperB;
  this.pauseOptions.sizeX = this.pausedFont.MeasureString('Paused').x;
  this.optionsButton = new Button(normal,hover,click);
  this.optionsButton.depth = 100;
  this.optionsButton.position = new Vec3(CANVAS.width - 55,CANVAS.height - 55,100);

  this.AddListener(CANVAS,'mousedown',function(e){
    self.optionsButton.onMouseDown();
  });
  this.AddListener(CANVAS,'mouseup',function(e){
    self.optionsButton.onMouseUp();
  });

  this.optionsButton.Action = function(){
    self.parent.pause = !self.parent.pause;
    self.paused = !self.paused;
    if (self.paused) {
      self.transitioning = true;
      self.transitionFadeOut.Stop();
      self.transitionFadeIn.CurrentPosition = self.transitionFadeOut.CurrentPosition;
      self.transitionFadeIn.Restart();
    }else if(!self.paused){
      self.transitioning = true;
      self.transitionFadeIn.Stop();
      self.transitionFadeOut.CurrentPosition = self.transitionFadeIn.CurrentPosition;
      self.transitionFadeOut.Restart();
    }
  };
  self.initialized = true;
};

HudScene.prototype.DrawSelf = function(batch){
  var self = this;
  batch.drawString(this.font,this.score.toString(),CANVAS.width - 150,50,this.fontOptions);
  this.optionsButton.Draw(batch);
  if (this.transitioning) {
    self.gl.defaultFontShader.setUniformf(1, self.gl.defaultFontShader.uLocations.uFade);
    batch.drawString(ASSETMANAGER.fonts.cooperB,'Paused',CANVAS.width/2 - (this.pauseOptions.sizeX * 1.25) / 2,350,this.pauseOptions);
  }
};

HudScene.prototype.UpdateSelf = function(delta){
  if (this.transitionFadeIn.active && !this.transitionFadeIn.finished) {
    this.transitionFadeIn.Update(delta);
  }
  if (this.transitionFadeOut.active && !this.transitionFadeOut.finished) {
    this.transitionFadeOut.Update(delta);
  }
  this.optionsButton.Hovered(this.mousePosition.x,this.mousePosition.y);
};
/* --------------- HudScene end ---------------*/


/* --------------- PickupScene ---------------*/
function PickupsScene(glContext){
  SceneNode.call(this,glContext);

  this.fruits = [];
  this.bonuses = [];
  this.globalOptions = {
    'rotation': 0,
    'color': 0xffffffff,
    'depth': 0
  };
  this.counter = 0;
  this.scores = [];
  this.font = ASSETMANAGER.fonts.cooperB;
  this.fontOptions = {
    scaleX: 0.5,
    scaleY: 0.5,
    color: 0xffffffff,
    outlineColor : 0xaa000000,
    smoothing: 0.1,
    depth: 100
  };
}


PickupsScene.prototype = Object.create(SceneNode.prototype);

PickupsScene.prototype.Init = function(){
  this.fruits.push(ASSETMANAGER.textures.banana);
  this.fruits.push(ASSETMANAGER.textures.cherries);
  this.fruits.push(ASSETMANAGER.textures.carrot);
  this.fruits.push(ASSETMANAGER.textures.grapes);
  this.fruits.push(ASSETMANAGER.textures.orange);
  this.fruits.push(ASSETMANAGER.textures.tomato);
  // NOTE(Inspix): Temporary just for testing purposes, needs a generation algorithm instead
  // this.bonuses.push(new Pickup(500,300,50,50,this.fruits[0],'banana'));
  // this.bonuses.push(new Pickup(555,300,50,50,this.fruits[0],'banana'));
  // this.bonuses.push(new Pickup(610,300,50,50,this.fruits[0],'banana'));
  // this.bonuses.push(new Pickup(1500,150,50,50,this.fruits[1],'cherries'));
  // this.bonuses.push(new Pickup(1550,150,50,50,this.fruits[1],'cherries'));
  // this.bonuses.push(new Pickup(1600,150,50,50,this.fruits[1],'cherries'));
  // this.bonuses.push(new Pickup(2000,150,50,50,this.fruits[2],'carrot'));
  // this.bonuses.push(new Pickup(2050,200,50,50,this.fruits[2],'carrot'));
  // this.bonuses.push(new Pickup(2100,250,50,50,this.fruits[2],'carrot'));
  // this.bonuses.push(new Pickup(3000,100,50,50,this.fruits[3],'grapes'));
  // this.bonuses.push(new Pickup(3050,100,50,50,this.fruits[3],'grapes'));
  // this.bonuses.push(new Pickup(3100,150,50,50,this.fruits[3],'grapes'));
  // this.bonuses.push(new Pickup(3150,200,50,50,this.fruits[4],'orange'));
  // this.bonuses.push(new Pickup(3150,250,50,50,this.fruits[4],'orange'));
  // this.bonuses.push(new Pickup(3200,300,50,50,this.fruits[5],'tomato'));
  for (var i = 0; i < 100; i++) {
    this.GenerateBonus(getRandomInt(500,50000),getRandomInt(100,500),getRandomInt(0,5));
  }
};

PickupsScene.prototype.GenerateBonus = function(x,y, count){
  var c = count || 1;
  var type = getRandomInt(0,5);
  for (var i = 0; i < c; i++) {
    this.bonuses.push(new Pickup(x + (i * 50),y,50,50,this.fruits[type],pickupType(type)));
  }
};

PickupsScene.prototype.UpdateSelf = function(delta){
  this.globalOptions.rotation = Math.sin(this.counter) * 20;
  this.counter += 0.05;
  var bonuses = this.bonuses;
  if (bonuses.length > 0) {
    var self = this;
    for (var i = 0; i < bonuses.length; i++) {
      var b = bonuses[i];
      if (b.active && !b.pickedUp && b.x > self.playerRect.left && b.x < self.playerRect.right ) {
        var result = b.CheckCollision(self.playerRect,20);
        if (result) {
          ASSETMANAGER.PlaySound('pop');
          b.info = b.getTypeInfo();
          self.hud.score += b.info.points;
        }
      }
    }
  }
};

PickupsScene.prototype.DrawSelf = function(batch){
  var bonuses = this.bonuses;
  if (bonuses.length > 0) {
    this.gl.defaultShader.setUniformMat4(this.camera.Matrix,this.gl.defaultShader.uLocations.uVwMatrix);
    this.gl.defaultFontShader.setUniformMat4(this.camera.Matrix,this.gl.defaultFontShader.uLocations.uVwMatrix);
    var self = this;
    for (var i = 0; i < bonuses.length; i++) {
      var b = bonuses[i];
      if (b.active && b.x > self.camera.x - b.width && b.x < self.camera.x + CANVAS.width) {
        if (b.pickedUp && b.lifeTime > 0) {
          batch.drawString(self.font,b.info.points.toString(),b.x,b.y + b.height + 10,this.fontOptions);
          b.y++;
          if (--b.lifeTime <= 0) {
            b.active = false;
            bonuses.splice(i,1);
            i--;
          }
        }else {
          self.globalOptions.destinationRectangle = b.BoundingBox;
          self.globalOptions.originX = b.width/2;
          self.globalOptions.originY = b.height/2;
          batch.DrawTexture(b.texture,self.globalOptions);
        }
      }
    }
    this.gl.defaultShader.setUniformMat4(Identity,this.gl.defaultShader.uLocations.uVwMatrix);
    this.gl.defaultFontShader.setUniformMat4(Identity,this.gl.defaultFontShader.uLocations.uVwMatrix);
  }
};
/* --------------- PickupScene end ---------------*/


/* --------------- SceneManager ---------------*/
function SceneManager(glContext) {
  this.gl = glContext;
  this.scenes = {};
  this._transitions = {};
  this._currentScene = null;
  this._currentTransition = null;
  this._nextScene = null;
  this._isTransitioning = false;

  this._changeScene = function(scene){
    if (this._currentTransition) {
      this._currentTransition.Start();
      this._nextScene = scene;
      this._isTransitioning = true;
    }
    else{
      this._currentScene = scene;
    }
  };

}
SceneManager.prototype = {
  get currentScene() { return this._currentScene;},
  set currentScene(value) {
    if (value instanceof SceneNode)
      this._currentScene = value;
  },
  get currentTransition() { return this._currentTransition;},
  set currentTransition(value) {
    if (value instanceof Transition)
      this._currentTransition = value;
  }
};

SceneManager.prototype.AddScene = function(id,scene){
  if (scene instanceof SceneNode) {
    this.scenes[id] = scene;
  }
};

SceneManager.prototype.RemoveScene = function(id){
  if (this.scenes[id]) {
    this.scenes[id] = null;
  }
};

SceneManager.prototype.Update = function(delta){
  if (this._isTransitioning) {
    this._currentTransition.Update(delta);
    if (this._currentTransition.finished) {
      this._isTransitioning = false;
      this._currentScene = this._nextScene;
    }
  }
  this._currentScene.Update(delta);
};

SceneManager.prototype.Draw = function(batch){
  if (this._currentScene instanceof SceneNode) {
    this._currentScene.Draw(batch);
  }
};

SceneManager.prototype.ChangeScene = function(scene){
  if (scene instanceof SceneNode) {
    this._changeScene(scene);
  }else if (this.scenes[scene]) {
    this._changeScene(this.scenes[scene]);
  }
};
/* --------------- SceneManager end ---------------*/


/* --------------- SceneNode ---------------*/
function SceneNode(glContext){
  this.gl = glContext;

  this.children = [];
  this.initialized = false;
  this.sceneManager = null;
  this.listeners = [];
  this.parent = null;

  this._release = function(){
    var l = this.listeners;
    for (var i = 0; i < l.length; i++) {
      var c = l[i];
      c.element.removeEventListener(c.event,c.func);
    }
    this.children = [];
    this.gl = null;
    this.sceneManager = null;
    this.listeners = [];
  };

  this._addListener = function(element,e,func){
    this.listeners.push({'element': element,'event': e,'func': func});
    element.addEventListener(e,func);
  };

  this._removeListener = function(element,e,func){
    var l = this.listeners;
    for (var i = 0; i < l.length; i++) {
      if (l[i].element === element) {
        if (l[i].event === e) {
          if (l[i].func === func) {
            l.splice(i,1);
            element.removeEventListener(e,func);
            return true;
          }
        }
      }
    }  return false;
  };
}

/**
* Default Init function, override to init assets etc.
*/
SceneNode.prototype.Init = function(){
  throw 'SceneNode Init not implemented';
};

/**
* 'Abstract' onFinish function, can be overriden to triger scene change etc.
*/
SceneNode.prototype.onFinish = function(){
  throw 'SceneNode onFinish not implemented';
};

/**
* Default Update function, calling UpdateSelf and update to all the nodes children.
* @param {float} delta Delta time. Defaults to 1 if none is passed
*/
SceneNode.prototype.Update = function(delta){
  var d = delta || 1;
  this.UpdateSelf(delta);
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].Update(batch);
  }
};

/**
* 'Abstract' UpdateSelf function, must be overriden with update logic.
*/
SceneNode.prototype.UpdateSelf = function(delta){
  throw 'Update self not implemented';
};

/**
* Default Draw function, calling DrawSelf and update to all the nodes children.
* @param {SpriteBatch} batch SpriteBatch used to DrawSelf and passed to all children.
*/
SceneNode.prototype.Draw = function(batch){
  if (batch instanceof SpriteBatch) {
    this.DrawSelf(batch);
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].Draw(batch);
    }
  }
};

/**
* 'Abstract' DrawSelf function, must be overriden with Draw logic.
*/
SceneNode.prototype.DrawSelf = function(batch){
  throw 'DrawSelf not implemented';
};

/**
* Add a node to the scene
* @param {SceneNode} node A node extending SceneNode
*/
SceneNode.prototype.AddNode = function(node){
  if (node instanceof SceneNode) {
    this.children.push(node);
    node.parent = this;
  }
};

/**
* Remove a node from the scene
* @param {SceneNode} node A node to be removed
*/
SceneNode.prototype.RemoveNode = function(node){
  if (node instanceof SceneNode) {
    for (var i = 0; i < this.children.length; i++) {
      if (node === this.children[i]) {
        this.children.splice(i,1);
        node.parent = null;
        return;
      }
    }
  }
};

SceneNode.prototype.AddListener = function(element,e,func){
  this._addListener(element,e,func);
};

SceneNode.prototype.RemoveListener = function(element,e,func){
  return this._removeListener(element,e,func);
};

SceneNode.prototype.Release = function(){
  this._release();
};
/* --------------- SceneNode end ---------------*/



/* --------------- SplashScreen Scene ---------------*/
function SplashScreenScene(gl) {
  // NOTE(Inspix): Initialize baseclass members
  SceneNode.call(this, gl);
  // NOTE(Inspix): Non baseclass members
  var self = this;
  this.background = null;
  this.logo = null;
  this.position = new Vec3(0, 0, 0);
  this.timeOnScreen = 100;
  this.font = null;
  this.bubbleGenerator = null;

  this.stringOptions = {
    scaleX: 0.75,
    scaleY: 1.0,
    rotation: 0,
    color: 0x00ff3377,
    outlineColor: 0x00110000,
    smoothing: 0.1,
    depth: 100,
    destinationC: 0xff0000aa,
    originalC: 0xff000000
  };

  this.selectedOption = {
    scaleX: 0.75,
    scaleY: 1,
    rotation: 0,
    color: 0x00333333,
    smoothing: 0.1,
    depth: 100
  };

  this.transitionMenu = new Transition(0,1000);
  this.transitionMenu.onUpdate = function(delta,percent){
    var amount = ((percent / 100) * 255) | 0;
    self.selectedOption.color = setChannel(self.selectedOption.color,'a',amount);
    self.stringOptions.color = setChannel(self.stringOptions.color,'a',amount);
    self.stringOptions.outlineColor = setChannel(self.stringOptions.outlineColor,'a',amount);
  };

  this.AddListener(window, 'keydown', KeyInput);

  this.menuOptions = ['New Game', 'About Us', 'Exit'];
  this.menuWidths = [];
  this.selectedMenu = 0;


  function KeyInput(e) {
    if (!self.transitionMenu.finished) return;

    switch (e.keyCode) {
      case 13:
        switch (self.selectedMenu) {
          case 0:
            var transition = new Transition(0,3000);
            transition.onUpdate = function(delta,percent){
              var value = (100 - percent)/ 100;
              self.gl.defaultShader.setUniformf(value,self.gl.defaultShader.uLocations.uFade);
              self.gl.defaultFontShader.setUniformf(value,self.gl.defaultFontShader.uLocations.uFade);
            };
            transition.onFinish = function(){
              self.sceneManager.currentTransition = null;
            };
            self.sceneManager.currentTransition = transition;
            self.sceneManager.ChangeScene('GamePlay');

            ASSETMANAGER.PlaySound('select');

            break;
          case 1:
            break;
          case 2:
            break;
        }
        break;
      case 40:
        if (self.selectedMenu < 2) {
          self.selectedMenu++;
          ASSETMANAGER.PlaySound('click');
        }
        break;
      case 38:
        if (self.selectedMenu > 0) {
          self.selectedMenu--;
          ASSETMANAGER.PlaySound('click');
        }
        break;
    }
  }
}

// NOTE(Inspix): Inherit from base object SceneNode
SplashScreenScene.prototype = Object.create(SceneNode.prototype);

// NOTE(Inspix): Override DrawSelf function of the base class
SplashScreenScene.prototype.DrawSelf = function(batch) {
  if (this.initialized) {
    batch.drawSprite(this.background);
    batch.drawSprite(this.logo);
    this.DrawMenu();
  }
};

// NOTE(Inspix): Override Update function of the base class
SplashScreenScene.prototype.UpdateSelf = function(delta) {
  if (this.initialized) {
    this.background.rotation = 0;
    this.LogoRotation();
    if (this.transitionMenu.finished) {
      if (this.stringOptions.outlineColor >>> 0 === this.stringOptions.destinationC >>> 0) {
        var temp = this.stringOptions.destinationC;
        this.stringOptions.destinationC = this.stringOptions.originalC;
        this.stringOptions.originalC = temp;
      }
      this.stringOptions.outlineColor = smoothTransition(this.stringOptions.outlineColor, this.stringOptions.destinationC, 5);
    }
  }

};

// NOTE(Inspix): Override onFinish function of the base class
// Can be used to triger a transition to another scene or event
SplashScreenScene.prototype.onFinish = function() {
  console.log("Scene Finished");
};

// NOTE(Inspix): Override Init function of the base class
// use to load all needed assets for the current Scene.
SplashScreenScene.prototype.Init = function() {
  var self = this;

  self.background = new Sprite(new Vec3(0, 0, 0), new Vec2(CANVAS.width, CANVAS.height), ASSETMANAGER.textures.background);
  self.logo = new Sprite(new Vec3((CANVAS.width / 2 - 400 / 2) - 20, CANVAS.height - 200, 0), new Vec2(400, 170), ASSETMANAGER.textures.logo);
  this.font = ASSETMANAGER.fonts.cooperBI;
  for (var i = 0; i < this.menuOptions.length; i++) {
    this.menuWidths.push(this.font.MeasureString(this.menuOptions[i]).x * 0.75);
  }
  this.initialized = true;
};

SplashScreenScene.prototype.LogoRotation = function() {
  var center = CANVAS.width / 2 - this.logo.width / 2;
  if (this.logo.position.x < center - 10 || this.logo.position.x > center + 20) {
    this.logo.position.x -= 10;
    if (this.logo.position.x <= -400) {
      this.logo.position.x = CANVAS.width;
    }
  }else{
    if (!this.transitionMenu.active && !this.transitionMenu.finished) {
      this.transitionMenu.Start();
    }else if (this.transitionMenu.active && !this.transitionMenu.finished) {
      this.transitionMenu.Update(1);
    }
  }
};

SplashScreenScene.prototype.DrawMenu = function() {
  var font = this.font;
  if (font.initialized) {
    var lineSpacing = 350;
    for (var i = 0; i < this.menuOptions.length; i++) {
      if (i === this.selectedMenu) {
        batch.drawString(font, this.menuOptions[i], CANVAS.width / 2 - this.menuWidths[i] / 2, lineSpacing, this.stringOptions);
      } else {
        batch.drawString(font, this.menuOptions[i], CANVAS.width / 2 - this.menuWidths[i] / 2, lineSpacing, this.selectedOption);
      }

      lineSpacing -= 75;
    }
  }
};
/* --------------- SplashScreen Scene end ---------------*/

/* --------------- Transition ---------------*/
function Transition(delay,duration){
  this.delay = delay;
  this.duration = duration;
  this.onUpdate = null;
  this.onFinish = null;
  this.finished = false;
  this.active = false;
  this._startTime = null;
  this.startingPosition = 0;
}

Transition.prototype = {
  get CurrentPosition() {
    if (!this._startTime) {
      return 0;
    }
    var current = performance.now() - this._startTime;
    return current;
  },
  set CurrentPosition(value) { this.startingPosition = value;}
};

Transition.prototype.Start = function(){
  this.active = true;
  var self = this;
  if (this.startingPosition === 0 || !self._startTime) {
    setTimeout(function() {
      self._startTime = performance.now();
    }, self.delay);
  }
};

Transition.prototype.Update = function(delta){
  if (!this.active) {
    return;
  }
    if (this.onUpdate && this._startTime) {
      var current = this.CurrentPosition - this.startingPosition;
      if (current >= this.duration) {

      }
      var percent = 100*(current/this.duration);
      if (percent > 100) {
        percent = 100;

        this.onUpdate(delta,percent);
        if (this.onFinish) {
          this.onFinish();
        }
        this.finished = true;
        this.active = false;
        return;
      }
      this.onUpdate(delta,percent);
    }
};

Transition.prototype.Restart = function(){
  this.active = true;
  this.finished = false;
  var self = this;
  setTimeout(function() {
    self._startTime = performance.now();
  }, self.delay);
};

Transition.prototype.HardRestart = function(){
  this.startingPosition = 0;
  this.Restart();
};

Transition.prototype.Stop = function(){
  this.active = false;
  var current = this.CurrentPosition;
  if (current > this.duration) {
    this.startingPosition = 0;
    this._startTime = null;
  }
  this.startingPosition = current;

};
/* --------------- Transition end ---------------*/


/* --------------- TrapScene ---------------*/
function TrapScene(glContext){
    SceneNode.call(this,glContext);

    this.traps = [];
    this.nextTrapX=1500;
    this.activeTraps = [];
    this.globalOptions = {
        'rotation': 0,
        'color': 0xffffffff,
        'depth': 20
    };
}

TrapScene.prototype = Object.create(SceneNode.prototype);

TrapScene.prototype.Init = function() {
    this.traps.push(ASSETMANAGER.textures.lineTrap);
    this.traps.push(ASSETMANAGER.textures.blockTrap);
    this.activeTraps.push(new Trap(500,this.traps[0],'line'));
    this.activeTraps.push(new Trap(1000,this.traps[1],'block'));

};

TrapScene.prototype.InitTraps = function(){
    var randomType = Math.floor(Math.random() * 2);
    if(randomType===1){
        this.activeTraps.push(new Trap(this.nextTrapX,this.traps[1],'block'));
    }
    else{
        this.activeTraps.push(new Trap(this.nextTrapX,this.traps[0],'line'));
    }
};

TrapScene.prototype.UpdateSelf = function(delta){
    var self = this;
    //must be fixed
    this.nextTrapX = self.playerRect.right + CANVAS.width;

    if(this.activeTraps.length<=2){
        this.InitTraps();
    }
    var activeTraps = this.activeTraps;
    if (activeTraps.length > 0) {
        for (var i = 0; i < activeTraps.length; i++) {
            var b = activeTraps[i];
            if (b.onScreen && !b.hit && b.x > self.playerRect.left && b.x < self.playerRect.right ) {
                var result = b.CheckCollision(self.playerRect,20);
                if (result) {
                    console.log("Game Over");
                }
            }
        }
    }
};

TrapScene.prototype.DrawSelf = function(batch) {
    var activeTraps = this.activeTraps;
    if (activeTraps.length > 0) {
        this.gl.defaultShader.setUniformMat4(this.camera.Matrix, this.gl.defaultShader.uLocations.uVwMatrix);
        this.gl.defaultFontShader.setUniformMat4(this.camera.Matrix, this.gl.defaultFontShader.uLocations.uVwMatrix);
        var self = this;
        for (var i = 0; i < activeTraps.length; i++) {
            var b = activeTraps[i];
            if (b.onScreen && b.x > self.camera.x - b.width && b.x < self.camera.x + CANVAS.width) {
                self.globalOptions.destinationRectangle = b.BoundingBox;
                self.globalOptions.rotation = b.rotation;
                batch.DrawTexture(b.texture, self.globalOptions);
            }else if(b.onScreen && b.x < self.camera.x) {
                b.onScreen = false;
                activeTraps.splice(i, 1);
                i--;
            }
        }
        this.gl.defaultShader.setUniformMat4(Identity, this.gl.defaultShader.uLocations.uVwMatrix);
        this.gl.defaultFontShader.setUniformMat4(Identity, this.gl.defaultFontShader.uLocations.uVwMatrix);
    }
};
/* --------------- TrapScene end ---------------*/

/* ========================= HELPERS ============================= */

function lerp(a,b,amount){
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw "Linear interpolation available to numbers only";
  }
  return b - amount*(b-a);
}


function smoothTransition(rgba, rgba2, amount) {

  if (rgba == rgba2) {
    return rgba;
  }

  var c1R = (rgba & 0xff);
  var c1G = ((rgba & 0xff00) >> 8);
  var c1B = ((rgba & 0xff0000) >> 16);
  var c1A = ((rgba & 0xff000000) >>> 24);

  var c2R = (rgba2 & 0xff);
  var c2G = ((rgba2 & 0xff00) >> 8);
  var c2B = ((rgba2 & 0xff0000) >> 16);
  var c2A = ((rgba2 & 0xff000000) >>> 24);


  c1A = c1A > c2A ? c1A - amount < c2A ? c2A : c1A - amount : c1A + amount > c2A ? c2A : c1A + amount;
  c1R = c1R > c2R ? c1R - amount < c2R ? c2R : c1R - amount : c1R + amount > c2R ? c2R : c1R + amount;
  c1G = c1G > c2G ? c1G - amount < c2G ? c2G : c1G - amount : c1G + amount > c2G ? c2G : c1G + amount;
  c1B = c1B > c2B ? c1B - amount < c2B ? c2B : c1B - amount : c1B + amount > c2B ? c2B : c1B + amount;

  var result = c1A << 24 | c1B << 16 | c1G << 8 | c1R;
  return result;
}

function setChannel(source,channel,value){
  if (isNaN(value)) {
    console.error('SetChannel needs valid numeric value.');
    return source;
  }else {
    value = value < 0 ? 0 : value > 255 ? 255 : value;
  }
  var result = source >>> 0;
  switch (channel.toLowerCase()) {
    case 'r':
      result = (result & 0xffffff00) | value;
      console.log(source.toString(16));
      return result;
    case 'g':
      result = (result  & 0xffff00ff) | value << 8;
      return result;
    case 'b':
      result = (result & 0xff00ffff) | value << 16;
      return result;
    case 'a':
      result = (result & 0xffffff) | value << 24;
      return result;
    default:
      return result;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function AARectColiding(rect1,rect2,shrink){

  if (rect1 instanceof Rect && rect2 instanceof Rect) {
    if (!shrink) {
      shrink = 0;
    }
    if (rect1.left < rect2.right - shrink && rect1.right > rect2.left + shrink &&
       rect1.bottom < rect2.top - shrink && rect1.top > rect2.bottom + shrink) {
        return true;
    }else {
      return false;
    }
  }
}

function clamp(value,min,max){
  return value < min ? min : value > max ? max : value;
}

/* ========================================================== MAIN =============================== */
var GL;
var CANVAS;
var batch;
var loadingFont;
var AUDIO;
var STATICMATRIX;
var ASSETMANAGER;
var FULLSCREEN = false;
var INITIALSIZE;

window.onerror = function(msg, url, line) {
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};

function init() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    AUDIO = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }


  CANVAS = document.getElementById('webgl-canvas');
  INITIALSIZE = CANVAS.getBoundingClientRect();
  GL = initWebGL(CANVAS);
  STATICMATRIX = new Mat4().createOrtho(0, CANVAS.width, CANVAS.height, 0, -100, 1000);
  GL.defaultShader.setUniformMat4(STATICMATRIX, GL.defaultShader.uLocations.uPrMatrix);
  GL.defaultFontShader.setUniformMat4(STATICMATRIX, GL.defaultFontShader.uLocations.uPrMatrix);
  batch = new SpriteBatch(GL);


  /* ---------------------- Load assets ---------------------- */
  ASSETMANAGER = new AssetManager();
  ASSETMANAGER.QueueToLoadFont('default', 'fonts/Calibri.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperB', 'fonts/CooperBlack.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperBI', 'fonts/CooperBlackItalic.fnt');
  ASSETMANAGER.QueueToLoadTexture('background', 'textures/bg.png');
  ASSETMANAGER.QueueToLoadTexture('logo', 'textures/logo.png');
  ASSETMANAGER.QueueToLoadTexture('pauseButton', 'textures/pauseButton.png');
  ASSETMANAGER.QueueToLoadTexture('bubble', 'textures/bubble.png');
  ASSETMANAGER.QueueToLoadTexture('grass', 'textures/grass.png');
  ASSETMANAGER.QueueToLoadTexture('lava', 'textures/lava.png');
  ASSETMANAGER.QueueToLoadTexture('player', 'textures/playerSprite.png');
  ASSETMANAGER.QueueToLoadTexture('banana', 'textures/banana.png');
  ASSETMANAGER.QueueToLoadTexture('carrot', 'textures/carrot.png');
  ASSETMANAGER.QueueToLoadTexture('cherries', 'textures/cherries.png');
  ASSETMANAGER.QueueToLoadTexture('grapes', 'textures/grapes.png');
  ASSETMANAGER.QueueToLoadTexture('orange', 'textures/orange.png');
  ASSETMANAGER.QueueToLoadTexture('tomato', 'textures/tomato.png');
  ASSETMANAGER.QueueToLoadTexture('blockTrap', 'textures/blockTrap.png');
  ASSETMANAGER.QueueToLoadTexture('lineTrap', 'textures/lineTrap.png');
  ASSETMANAGER.QueueToLoadSound('pop', 'sounds/pop1.ogg');
  ASSETMANAGER.QueueToLoadSound('click', 'sounds/menuClick.ogg');
  ASSETMANAGER.QueueToLoadSound('select', 'sounds/menuSelect.mp3');
  ASSETMANAGER.QueueToLoadSong('gameplay', 'sounds/gameplaySong.ogg');
  ASSETMANAGER.QueueToLoadSong('menu', 'sounds/menuSong.ogg');

  ASSETMANAGER.onProgressUpdate = function(percent, msg) {
    cent = percent / 100;
    loading(msg);
  };
  ASSETMANAGER.onLoad = function() {
    // glContext, positionVec, width, heigth, colorArray
    var gameplayScene = new GamePlayScene(GL, CANVAS);
    gameplayScene.Init();
    var Scene = new SplashScreenScene(GL);
    Scene.Init();
    sceneManager = new SceneManager(GL);
    Scene.sceneManager = sceneManager;
    gameplayScene.sceneManager = sceneManager;

    sceneManager.AddScene('Splash', Scene);
    sceneManager.AddScene('GamePlay', gameplayScene);

    sceneManager.ChangeScene('Splash');
    ASSETMANAGER.PlaySong('menu',true,null,2000);
    setTimeout(drawScene, 1000);
  };

  loadingFont = new SpriteFont(GL, 'fonts/Calibri.fnt');
  loadingFont.onLoad = function() {
    ASSETMANAGER.AddFont('default', this);
    ASSETMANAGER.Load();
    console.log("font loaded");
  };
  loadingFont.Init();

  /* ---------------------- Load Assets End ------------------- */

}

function fullscreen() {
  var element = document.getElementById('wrapper');
  if (!FULLSCREEN) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
      FULLSCREEN = true;
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
      FULLSCREEN = true;
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
      FULLSCREEN = true;
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
      FULLSCREEN = true;
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      FULLSCREEN = false;
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      FULLSCREEN = false;
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
      FULLSCREEN = false;
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      FULLSCREEN = false;
    }
  }
}

var lineLength = 500;
var cent = 0;
var width = 100;

function loading(msg) {
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
  batch.begin();
  batch.drawRect(new Rect(50, 50, 50 + lineLength, 50), {
    color: 0xff0000ff,
    thickness: 4
  });
  batch.drawQuad(new Rect(50, 50, 50 + (lineLength * cent), 50), {
    color: 0xff888888
  });
  batch.drawString(loadingFont, msg, 100, 100, {
    scaleX: 0.5,
    scaleY: 0.5
  });
  batch.End();
}
var counter = 0.01;
function drawScene() {
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
  batch.begin();
  sceneManager.Draw(batch);

  batch.End();
  sceneManager.Update(1);

  requestAnimationFrame(drawScene);
}
