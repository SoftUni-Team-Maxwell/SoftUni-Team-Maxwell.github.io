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
