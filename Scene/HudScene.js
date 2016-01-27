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
