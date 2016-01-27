function SceneManager(glContext) {
  this.gl = glContext;
  this.scenes = {};
  this._transitions = {};
  this._currentScene = null;
  this._currentTransition = null;
  this._nextScene = null;
  this._isTransitioning = false;

  this._changeScene = function(scene){
    if (this._currentTransition) {
      this._currentTransition.Start();
      this._nextScene = scene;
      this._isTransitioning = true;
    }
    else{
      this._currentScene = scene;
    }
  };

}
SceneManager.prototype = {
  get currentScene() { return this._currentScene;},
  set currentScene(value) {
    if (value instanceof SceneNode)
      this._currentScene = value;
  },
  get currentTransition() { return this._currentTransition;},
  set currentTransition(value) {
    if (value instanceof Transition)
      this._currentTransition = value;
  }
};

SceneManager.prototype.AddScene = function(id,scene){
  if (scene instanceof SceneNode) {
    this.scenes[id] = scene;
  }
};

SceneManager.prototype.RemoveScene = function(id){
  if (this.scenes[id]) {
    this.scenes[id] = null;
  }
};

SceneManager.prototype.Update = function(delta){
  if (this._isTransitioning) {
    this._currentTransition.Update(delta);
    if (this._currentTransition.finished) {
      this._isTransitioning = false;
      this._currentScene = this._nextScene;
    }
  }
  this._currentScene.Update(delta);
};

SceneManager.prototype.Draw = function(batch){
  if (this._currentScene instanceof SceneNode) {
    this._currentScene.Draw(batch);
  }
};

SceneManager.prototype.ChangeScene = function(scene){
  if (scene instanceof SceneNode) {
    this._changeScene(scene);
  }else if (this.scenes[scene]) {
    this._changeScene(this.scenes[scene]);
  }
};
