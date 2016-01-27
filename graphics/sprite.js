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
