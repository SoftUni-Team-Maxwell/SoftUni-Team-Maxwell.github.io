function SpriteFont(glContext, filePath) {
  this.gl = glContext;
  this.initialized = false;
  this.charInfo = {};
  this.texture = null;
  this.filePath = filePath;
}

SpriteFont.prototype.MeasureString = function(string) {
  var result = new Vec2(0, 0);

  for (var i = 0; i < string.length; i++) {
    var c = this.charInfo[string.charCodeAt(i)];

    var heightOutput = c.height * this.texture.originalHeight;
    if (i < string.length - 1) {
      result.x += c.xadvance;
    }
    if (result.y < heightOutput) {
      result.y = heightOutput;
    }
  }
  return result;
};

SpriteFont.prototype.Init = function(){
  var self = this;
  var image = new Image();
  image.src = this.filePath.replace('fnt', 'png');
  image.onload = function() {
    self.texture = new Texture(self.gl, this);

    readFile(self.filePath, function(data) {
      var text = data.split('\n');
      var regex = /([0-9\.\-]+)/g;
      for (var i = 1; i < text.length; i++) {
        var info = {};
        var index = 0;
        // TODO(Inspix): Add kernings to the calculation.
        while ((matches = regex.exec(text[i])) !== null) {
          var value = parseInt(matches[1]);
          if (index === 2) {
            value = image.naturalHeight - value;
          }
          if (!(index === 0 || index === 7)) {
            value /= image.naturalWidth;
          }

          info[getCharInfoProperty(index++)] = value;
        }
        self.charInfo[info.char] = info;
      }
      if (self.onLoad) {
        self.onLoad();
      }
      self.initialized = true;
    });
  };
};

SpriteFont.prototype.onLoad = null;

SpriteFont.prototype.Release = function(){
  this.texture.Release();
  this.charInfo = {};
};

function getCharInfoProperty(index) {
  switch (index) {
    case 0:
      return 'char';
    case 1:
      return 'x';
    case 2:
      return 'y';
    case 3:
      return 'width';
    case 4:
      return 'height';
    case 5:
      return 'xoffset';
    case 6:
      return 'yoffset';
    case 7:
      return 'xadvance';
    default:
      return 'unknown';
  }
}

function readFile(filePath, callback) {
  var req;

  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else {
    req = new ActiveXObject("Microsoft.XMLHTTP");
  }

  req.onreadystatechange = function() {
    if (this.readyState == 4) {
      var lines = this.responseText;
      callback(this.responseText);
    }
  };
  req.open("GET", filePath, true);
  req.send();
}
