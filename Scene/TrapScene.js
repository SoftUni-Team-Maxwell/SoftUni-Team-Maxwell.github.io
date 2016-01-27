function TrapScene(glContext){
    SceneNode.call(this,glContext);

    this.traps = [];
    this.nextTrapX=1500;
    this.activeTraps = [];
    this.globalOptions = {
        'rotation': 0,
        'color': 0xffffffff,
        'depth': 20
    };
}

TrapScene.prototype = Object.create(SceneNode.prototype);

TrapScene.prototype.Init = function() {
    this.traps.push(ASSETMANAGER.textures.lineTrap);
    this.traps.push(ASSETMANAGER.textures.blockTrap);
    this.activeTraps.push(new Trap(500,this.traps[0],'line'));
    this.activeTraps.push(new Trap(1000,this.traps[1],'block'));

};

TrapScene.prototype.InitTraps = function(){
    var randomType = Math.floor(Math.random() * 2);
    if(randomType===1){
        this.activeTraps.push(new Trap(this.nextTrapX,this.traps[1],'block'));
    }
    else{
        this.activeTraps.push(new Trap(this.nextTrapX,this.traps[0],'line'));
    }
};

TrapScene.prototype.UpdateSelf = function(delta){
    var self = this;
    //must be fixed
    this.nextTrapX = self.playerRect.right + CANVAS.width;

    if(this.activeTraps.length<=2){
        this.InitTraps();
    }
    var activeTraps = this.activeTraps;
    if (activeTraps.length > 0) {
        for (var i = 0; i < activeTraps.length; i++) {
            var b = activeTraps[i];
            if (b.onScreen && !b.hit && b.x > self.playerRect.left && b.x < self.playerRect.right ) {
                var result = b.CheckCollision(self.playerRect,20);
                if (result) {
                    console.log("Game Over");
                }
            }
        }
    }
};

TrapScene.prototype.DrawSelf = function(batch) {
    var activeTraps = this.activeTraps;
    if (activeTraps.length > 0) {
        this.gl.defaultShader.setUniformMat4(this.camera.Matrix, this.gl.defaultShader.uLocations.uVwMatrix);
        this.gl.defaultFontShader.setUniformMat4(this.camera.Matrix, this.gl.defaultFontShader.uLocations.uVwMatrix);
        var self = this;
        for (var i = 0; i < activeTraps.length; i++) {
            var b = activeTraps[i];
            if (b.onScreen && b.x > self.camera.x - b.width && b.x < self.camera.x + CANVAS.width) {
                self.globalOptions.destinationRectangle = b.BoundingBox;
                self.globalOptions.rotation = b.rotation;
                batch.DrawTexture(b.texture, self.globalOptions);
            }else if(b.onScreen && b.x < self.camera.x) {
                b.onScreen = false;
                activeTraps.splice(i, 1);
                i--;
            }
        }
        this.gl.defaultShader.setUniformMat4(Identity, this.gl.defaultShader.uLocations.uVwMatrix);
        this.gl.defaultFontShader.setUniformMat4(Identity, this.gl.defaultFontShader.uLocations.uVwMatrix);
    }
};
