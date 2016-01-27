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
