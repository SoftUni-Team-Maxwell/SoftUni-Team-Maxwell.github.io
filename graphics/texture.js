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
