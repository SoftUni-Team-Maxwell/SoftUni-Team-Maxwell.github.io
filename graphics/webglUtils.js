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
