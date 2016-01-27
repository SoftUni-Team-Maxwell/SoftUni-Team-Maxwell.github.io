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
