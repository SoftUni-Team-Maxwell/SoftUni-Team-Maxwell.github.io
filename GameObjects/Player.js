function Player(sprite, numRows, numFrames){
    this.numRows = numRows;
    this.numFrames = numFrames;
    this.x = 200;
    this.y = 200;
    this.sprite = sprite;
    this.width = this.sprite.width / this.numFrames; //may replace this.sprite.width with 1 to get 0.25 as coordinate;
    this.height = this.sprite.height / this.numRows;
    this.frames = this.createBitmap(this.sprite);
    this.animation = new Animation(frames);

    Player.prototype.createBitmap = function (sprite){
        var currentFrames = [];
        for (var j = 0; j < this.numRows; j++) {
            currentFrames[j]=[];
            for (var i = 0; i < this.numFrames; i++) {
                ///currentFrames[j][i] = new Sprite(this.gl,new Vec3(canvas.width,0,0),new Vec2(player.width/4,player.height/4),player,cord);
            }
        }
        return currentFrames;
    };

    Player.prototype.update = function (){
        this.animation.update();
    };

}
