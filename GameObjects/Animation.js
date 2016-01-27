function Animation(frames){
    this.frames = frames;
    this.currentFrame=0;
    this.currentRow=0;
    this.numOfFrames = this.frames[0].length;
    this.numOfRows = this.frames.length;

    Animation.prototype.update = function(){
        this.currentFrame++;
        if(this.currentFrame>=this.numOfFrames){
            this.currentFrame = 0;
            this.currentRow++;
        }
        if(this.currentRow>=this.numOfRows){
            this.currentRow = 0;
        }
    }

    Animation.prototype.getImage = function(){
        return this.frames[this.currentRow][this.currentFrame]
    }

}

