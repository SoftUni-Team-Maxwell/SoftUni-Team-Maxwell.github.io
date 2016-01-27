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
