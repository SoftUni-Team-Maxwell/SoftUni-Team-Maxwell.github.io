function Transition(delay,duration){
  this.delay = delay;
  this.duration = duration;
  this.onUpdate = null;
  this.onFinish = null;
  this.finished = false;
  this.active = false;
  this._startTime = null;
  this.startingPosition = 0;
}

Transition.prototype = {
  get CurrentPosition() {
    if (!this._startTime) {
      return 0;
    }
    var current = performance.now() - this._startTime;
    return current;
  },
  set CurrentPosition(value) { this.startingPosition = value;}
};

Transition.prototype.Start = function(){
  this.active = true;
  var self = this;
  if (this.startingPosition === 0 || !self._startTime) {
    setTimeout(function() {
      self._startTime = performance.now();
    }, self.delay);
  }
};

Transition.prototype.Update = function(delta){
  if (!this.active) {
    return;
  }
    if (this.onUpdate && this._startTime) {
      var current = this.CurrentPosition - this.startingPosition;
      if (current >= this.duration) {

      }
      var percent = 100*(current/this.duration);
      if (percent > 100) {
        percent = 100;

        this.onUpdate(delta,percent);
        if (this.onFinish) {
          this.onFinish();
        }
        this.finished = true;
        this.active = false;
        return;
      }
      this.onUpdate(delta,percent);
    }
};

Transition.prototype.Restart = function(){
  this.active = true;
  this.finished = false;
  var self = this;
  setTimeout(function() {
    self._startTime = performance.now();
  }, self.delay);
};

Transition.prototype.HardRestart = function(){
  this.startingPosition = 0;
  this.Restart();
};

Transition.prototype.Stop = function(){
  this.active = false;
  var current = this.CurrentPosition;
  if (current > this.duration) {
    this.startingPosition = 0;
    this._startTime = null;
  }
  this.startingPosition = current;

};
