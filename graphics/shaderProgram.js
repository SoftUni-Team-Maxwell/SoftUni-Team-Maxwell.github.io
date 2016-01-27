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
