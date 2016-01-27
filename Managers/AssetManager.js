function AssetManager(glContext){
  this.gl = glContext;
  this.images = [];
  this.textures = {};
  this.sounds = {};
  this.songs = {};
  this.sprites = {};
  this.fonts = {};
  this.queue = {
    textures: [],
    sprites : [],
    sounds : [],
    songs : [],
    fonts : [],
  };
  this.loaded = 0;
  this.total = 0;
  this.songGain = AUDIO.createGain();
  this.soundGain = AUDIO.createGain();
  this._songVolume = 1;
  this._soundVolume = 1;
}

AssetManager.prototype = {
  constructor: AssetManager,
  get SoundVolume() {return this._soundVolume;},
  set SoundVolume(value) {
    if (isNaN(value)) {
      return;
    }
    var v = clamp(value,0,1);
    this._soundVolume = v;
    this.soundGain.gain.value = v;
  },
  get SongVolume() {return this._songVolume;},
  set SongVolume(value) {
    if (isNaN(value)) {
      return;
    }
    var v = clamp(value,0,1);
    this._songVolume = v;
    this.songGain.gain.value = v;
  },
  AddTexture: function(id,texture){
    this.textures[id] = texture;
  },
  AddSound: function(id,sound){
    this.sounds[id] = sound;
  },
  AddSong: function(id,song){
    this.songs[id] = song;
  },
  AddSprite: function(id,sprite){
    this.sprites[id] = sprite;
  },
  AddFont: function(id,font){
    this.sprites[id] = font;
  },
  QueueToLoadTexture: function(id,imageUrl){
    this.queue.textures.push({'id' : id, url : imageUrl});
  },
  QueueToLoadSound: function(id,soundUrl){
    this.queue.sounds.push({'id' : id, url : soundUrl});
  },
  QueueToLoadSong: function(id,songUrl){
    this.queue.songs.push({'id' : id, url : songUrl});
  },
  QueueToLoadSprite: function(id,textureId,options){
    this.queue.sprites.push({'id' : id, texId:textureId,'options' : options});
  },
  QueueToLoadFont: function(id,fontUrl){
    this.queue.fonts.push({'id':id,url:fontUrl});
  },
  Load : function(onFinish){


    var q = this.queue;
    this.total = q.textures.length + q.songs.length + q.sounds.length + q.fonts.length + q.sprites.length;
    this.loaded = 0;
    for (var i = 0; i < q.textures.length; i++) {
      var item = q.textures[i];
      this.LoadImage(i, item);
    }
    for (var s = 0; s < q.sounds.length; s++) {
        var sound = q.sounds[s];
        this.LoadSound(sound);
    }
    for (var snd = 0; snd < q.songs.length; snd++) {
        var song = q.songs[snd];
        this.LoadSong(song);
    }
    for (var sp = 0; sp < q.sprites.length; sp++) {
      var sprite = q.sprites[sp];
      //function Sprite(gl, vec3Pos, vec2size, texture, texCoords, colors) {
      var position = sprite.options.position || new Vec3(0,0,0);
      var size = sprite.options.size || new Vec2(100,100);
      this.sprites[sprite.id] = new Sprite(position,size,this.textures[sprite.textureId]);
      this.loaded++;
      this.onProgressUpdate(100*(this.loaded/this.total),'sprites/' + sprite.id);
      if (this.isLoaded()) {
        if (this.onLoad) {
          this.onLoad();
        }
      }
    }
    for (var f = 0; f < q.fonts.length; f++) {
      var font = q.fonts[f];
      this.LoadFont(font);

    }
  },
  ReleaseTexture: function(id,texture){
    this.textures[id].Release();
  },
  ReleaseSound: function(id,sound){
    this.sounds[id].Release();
  },
  ReleaseSong: function(id,song){
    this.song[id].Release();
  },
  ReleaseSprite: function(id,sprite){
    this.sprites[id] = sprite;
  },
  ReleaseFont: function(id,font){
    this.sprites[id].Release();
  },
  onProgressUpdate : function(percent,msg){
    throw 'not implemented';
  },
  LoadImage : function(index,item){
    var self = this;
    var img = new Image();
    img.onload = function(){
      self.textures[item.id] = new Texture(GL,img);
      self.loaded++;
      self.onProgressUpdate(100*(self.loaded/self.total),'textures/'+item.id);
      if (self.isLoaded()) {
        if (self.onLoad) {
          self.onLoad();
        }
      }
    };
    img.src = item.url;
  },
  LoadFont : function(font){
    var self = this;
    var current = new SpriteFont(GL,font.url);
    current.onLoad = function(){
      self.loaded++;
      self.onProgressUpdate(100*(self.loaded/self.total),'fonts/' + font.id);
      self.fonts[font.id] = current;
      if (self.isLoaded()) {
        if (self.onLoad) {
          self.onLoad();
        }
      }
    };
    current.Init();
  },
  LoadSound : function(sound){
    this.LoadAudio(sound,false);
  },
  LoadSong : function(song){
    this.LoadAudio(song,true);
  },
  LoadAudio : function(item,song){
    var request = new XMLHttpRequest();
    request.open('GET', item.url, true);
    request.responseType = 'arraybuffer';
    var self = this;
    request.onload = function() {
      AUDIO.decodeAudioData(request.response, function(buffer) {
        if (song) {
          self.songs[item.id] = buffer;
        }else {
          self.sounds[item.id] = buffer;
        }
        self.loaded++;
        self.onProgressUpdate(100*(self.loaded/self.total),'sounds/' + item.id);
        if (self.isLoaded()) {
          if (self.onLoad) {
            self.onLoad();
          }
        }
      }, function(error){
        console.log(error);
      });
    };
    request.send();
  },
  onLoad : null,
  isLoaded : function isLoaded(){
    if (this.total <= this.loaded) {
      return true;
    }
    return false;
  },
  PlaySound: function(sound){
    var buffer = this.sounds[sound];
    if (!buffer) {
      return;
    }
    var source = AUDIO.createBufferSource();
    source.buffer = buffer;
    source.connect(this.soundGain);
    this.soundGain.gain.value = this.SoundVolume;
    this.soundGain.connect(AUDIO.destination);
    source.start(0);
  },
  PlaySong: function(song,loop,fadeOut,fadeIn){
    if (this.fadeInInterval) {
      return;
    }
    var self = this;

    if (self.currentSong) {
      var next = {
        id : song,
        'loop' : loop,
        'fadeIn' : fadeIn
      };
      self.StopCurrentSong(fadeOut,next);
      return;
    }
    var buffer = self.songs[song];
    if (!buffer) {
      return;
    }
    if (fadeIn) {
      self.songGain.gain.value = 0;
      var interval = fadeIn/50;
      self.fadeInInterval = setInterval(function(){
        self.songGain.gain.value += self.SongVolume / interval;
        if (self.songGain.gain.value >= self.SongVolume) {
          clearInterval(self.fadeInInterval);
          self.fadeInInterval = null;
        }
      },50);
    } else {
      self.songGain.gain.value = self.SongVolume;
    }
    self.currentSong = AUDIO.createBufferSource();
    self.currentSong.buffer = buffer;
    self.currentSong.connect(self.songGain);
    self.songGain.connect(AUDIO.destination);
    self.currentSong.start(0);
    self.currentSong.loop = loop;
  },
  StopCurrentSong : function(fade,next){
    if (this.songInterval) {
      return;
    }
    var self = this;
    if (self.currentSong) {
      if (fade) {
        var intervals = fade / 50;
        self.songInterval = setInterval(function(){
          self.songGain.gain.value -= 1 / intervals;
          if (self.songGain.gain.value <= 0) {
            clearInterval(self.songInterval);
            self.currentSong.stop();
            self.currentSong = null;
            self.songInterval = null;
            if (next) {
              self.PlaySong(next.id,next.loop,null,next.fadeIn);
            }
          }
        },50);
      }else {
        self.currentSong.stop();
        self.currentSong = null;
      }
    }
  }
};
