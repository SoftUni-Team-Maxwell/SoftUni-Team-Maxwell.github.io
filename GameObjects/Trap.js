function Trap(x,texture,type){
    this.boundingBox = this.GenerateBoundingBox(x,type);
    this.texture = texture;
    this.type = type;
    this.onScreen = true;
    this.hit = false;
    this.lifeTime = 35;
}

Trap.prototype = {
    constructor : Trap,
    get x() { return this.boundingBox.x;},
    set x(value) {
        if (isNaN(value)) {
            return;
        }
        this.boundingBox.x = value;
    },
    get y() { return this.boundingBox.y;},
    set y(value) {
        if (isNaN(value)) {
            return;
        }
        this.boundingBox.y = value;
    },
    get width() {
        return this.boundingBox.width;
    },
    get height() {
        return this.boundingBox.height;
    },
    get BoundingBox(){
        return this.boundingBox;
    },
    CheckCollision : function(rect,shrink){

        var result = AARectColiding(this.boundingBox,rect,shrink);
        if (result === true) {
            //console.log("TRAP HITTT");
        }
        return result;
    },
    GenerateBoundingBox : function(x,type) {
        var currentY = this.GenerateY(type);
        if(type ==='line'){
            return new Rect(x, currentY, 100, 100);
        }
        return new Rect(x, currentY, 250, 250);

    },
    GenerateY : function(type){
        if(type ==='line'){
            var random = Math.floor(Math.random() * 2);
            if(random===1){
                return 540;
            }
            return 80;
        }
        else{
            return Math.floor(Math.random() * 250)+150;
        }
    },

};
