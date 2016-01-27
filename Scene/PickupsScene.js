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
