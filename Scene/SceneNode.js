function SceneNode(glContext){
  this.gl = glContext;

  this.children = [];
  this.initialized = false;
  this.sceneManager = null;
  this.listeners = [];
  this.parent = null;

  this._release = function(){
    var l = this.listeners;
    for (var i = 0; i < l.length; i++) {
      var c = l[i];
      c.element.removeEventListener(c.event,c.func);
    }
    this.children = [];
    this.gl = null;
    this.sceneManager = null;
    this.listeners = [];
  };

  this._addListener = function(element,e,func){
    this.listeners.push({'element': element,'event': e,'func': func});
    element.addEventListener(e,func);
  };

  this._removeListener = function(element,e,func){
    var l = this.listeners;
    for (var i = 0; i < l.length; i++) {
      if (l[i].element === element) {
        if (l[i].event === e) {
          if (l[i].func === func) {
            l.splice(i,1);
            element.removeEventListener(e,func);
            return true;
          }
        }
      }
    }  return false;
  };
}

/**
* Default Init function, override to init assets etc.
*/
SceneNode.prototype.Init = function(){
  throw 'SceneNode Init not implemented';
};

/**
* 'Abstract' onFinish function, can be overriden to triger scene change etc.
*/
SceneNode.prototype.onFinish = function(){
  throw 'SceneNode onFinish not implemented';
};

/**
* Default Update function, calling UpdateSelf and update to all the nodes children.
* @param {float} delta Delta time. Defaults to 1 if none is passed
*/
SceneNode.prototype.Update = function(delta){
  var d = delta || 1;
  this.UpdateSelf(delta);
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].Update(batch);
  }
};

/**
* 'Abstract' UpdateSelf function, must be overriden with update logic.
*/
SceneNode.prototype.UpdateSelf = function(delta){
  throw 'Update self not implemented';
};

/**
* Default Draw function, calling DrawSelf and update to all the nodes children.
* @param {SpriteBatch} batch SpriteBatch used to DrawSelf and passed to all children.
*/
SceneNode.prototype.Draw = function(batch){
  if (batch instanceof SpriteBatch) {
    this.DrawSelf(batch);
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].Draw(batch);
    }
  }
};

/**
* 'Abstract' DrawSelf function, must be overriden with Draw logic.
*/
SceneNode.prototype.DrawSelf = function(batch){
  throw 'DrawSelf not implemented';
};

/**
* Add a node to the scene
* @param {SceneNode} node A node extending SceneNode
*/
SceneNode.prototype.AddNode = function(node){
  if (node instanceof SceneNode) {
    this.children.push(node);
    node.parent = this;
  }
};

/**
* Remove a node from the scene
* @param {SceneNode} node A node to be removed
*/
SceneNode.prototype.RemoveNode = function(node){
  if (node instanceof SceneNode) {
    for (var i = 0; i < this.children.length; i++) {
      if (node === this.children[i]) {
        this.children.splice(i,1);
        node.parent = null;
        return;
      }
    }
  }
};

SceneNode.prototype.AddListener = function(element,e,func){
  this._addListener(element,e,func);
};

SceneNode.prototype.RemoveListener = function(element,e,func){
  return this._removeListener(element,e,func);
};

SceneNode.prototype.Release = function(){
  this._release();
};
