var GL;
var CANVAS;
var batch;
var loadingFont;
var AUDIO;
var STATICMATRIX;
var ASSETMANAGER;
var FULLSCREEN = false;
var INITIALSIZE;
document.addEventListener("DOMContentLoaded", init);

window.onerror = function(msg, url, line) {
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};

function init() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    AUDIO = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }


  CANVAS = document.getElementById('webgl-canvas');
  INITIALSIZE = CANVAS.getBoundingClientRect();
  GL = initWebGL(CANVAS);
  STATICMATRIX = new Mat4().createOrtho(0, CANVAS.width, CANVAS.height, 0, -100, 1000);
  GL.defaultShader.setUniformMat4(STATICMATRIX, GL.defaultShader.uLocations.uPrMatrix);
  GL.defaultFontShader.setUniformMat4(STATICMATRIX, GL.defaultFontShader.uLocations.uPrMatrix);
  batch = new SpriteBatch(GL);


  /* ---------------------- Load assets ---------------------- */
  ASSETMANAGER = new AssetManager();
  ASSETMANAGER.QueueToLoadFont('default', 'fonts/Calibri.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperB', 'fonts/CooperBlack.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperBI', 'fonts/CooperBlackItalic.fnt');
  ASSETMANAGER.QueueToLoadTexture('background', 'textures/bg.png');
  ASSETMANAGER.QueueToLoadTexture('logo', 'textures/logo.png');
  ASSETMANAGER.QueueToLoadTexture('pauseButton', 'textures/pauseButton.png');
  ASSETMANAGER.QueueToLoadTexture('bubble', 'textures/bubble.png');
  ASSETMANAGER.QueueToLoadTexture('grass', 'textures/grass.png');
  ASSETMANAGER.QueueToLoadTexture('lava', 'textures/lava.png');
  ASSETMANAGER.QueueToLoadTexture('player', 'textures/playerSprite.png');
  ASSETMANAGER.QueueToLoadTexture('banana', 'textures/banana.png');
  ASSETMANAGER.QueueToLoadTexture('carrot', 'textures/carrot.png');
  ASSETMANAGER.QueueToLoadTexture('cherries', 'textures/cherries.png');
  ASSETMANAGER.QueueToLoadTexture('grapes', 'textures/grapes.png');
  ASSETMANAGER.QueueToLoadTexture('orange', 'textures/orange.png');
  ASSETMANAGER.QueueToLoadTexture('tomato', 'textures/tomato.png');
  ASSETMANAGER.QueueToLoadTexture('blockTrap', 'textures/blockTrap.png');
  ASSETMANAGER.QueueToLoadTexture('lineTrap', 'textures/lineTrap.png');
  ASSETMANAGER.QueueToLoadSound('pop', 'sounds/pop1.ogg');
  ASSETMANAGER.QueueToLoadSound('click', 'sounds/menuClick.ogg');
  ASSETMANAGER.QueueToLoadSound('select', 'sounds/menuSelect.mp3');
  ASSETMANAGER.QueueToLoadSong('gameplay', 'sounds/gameplaySong.ogg');
  ASSETMANAGER.QueueToLoadSong('menu', 'sounds/menuSong.ogg');

  ASSETMANAGER.onProgressUpdate = function(percent, msg) {
    cent = percent / 100;
    loading(msg);
  };
  ASSETMANAGER.onLoad = function() {
    // glContext, positionVec, width, heigth, colorArray
    var gameplayScene = new GamePlayScene(GL, CANVAS);
    gameplayScene.Init();
    var Scene = new SplashScreenScene(GL);
    Scene.Init();
    sceneManager = new SceneManager(GL);
    Scene.sceneManager = sceneManager;
    gameplayScene.sceneManager = sceneManager;

    sceneManager.AddScene('Splash', Scene);
    sceneManager.AddScene('GamePlay', gameplayScene);

    sceneManager.ChangeScene('Splash');
    ASSETMANAGER.PlaySong('menu',true,null,2000);
    setTimeout(drawScene, 1000);
  };

  loadingFont = new SpriteFont(GL, 'fonts/Calibri.fnt');
  loadingFont.onLoad = function() {
    ASSETMANAGER.AddFont('default', this);
    ASSETMANAGER.Load();
    console.log("font loaded");
  };
  loadingFont.Init();

  /* ---------------------- Load Assets End ------------------- */

}

function fullscreen() {
  var element = document.getElementById('wrapper');
  if (!FULLSCREEN) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
      FULLSCREEN = true;
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
      FULLSCREEN = true;
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
      FULLSCREEN = true;
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
      FULLSCREEN = true;
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      FULLSCREEN = false;
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      FULLSCREEN = false;
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
      FULLSCREEN = false;
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      FULLSCREEN = false;
    }
  }
}

var lineLength = 500;
var cent = 0;
var width = 100;

function loading(msg) {
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
  batch.begin();
  batch.drawRect(new Rect(50, 50, 50 + lineLength, 50), {
    color: 0xff0000ff,
    thickness: 4
  });
  batch.drawQuad(new Rect(50, 50, 50 + (lineLength * cent), 50), {
    color: 0xff888888
  });
  batch.drawString(loadingFont, msg, 100, 100, {
    scaleX: 0.5,
    scaleY: 0.5
  });
  batch.End();
}
var counter = 0.01;
function drawScene() {
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
  batch.begin();
  sceneManager.Draw(batch);

  batch.End();
  sceneManager.Update(1);

  requestAnimationFrame(drawScene);
}
