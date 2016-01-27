function Pickup(x,y,width,height,texture,type){
  this.boundingBox = new Rect(x,y,width,height);
  this.texture = texture;
  this.type = type;
  this.active = true;
  this.pickedUp = false;
  this.lifeTime = 35;

}

Pickup.prototype = {
  constructor : Pickup,
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
    if (this.pickedUp) {
      return false;
    }
    var result = AARectColiding(this.boundingBox,rect,shrink);
    if (result === true) {
      this.pickedUp = true;
    }
    return result;
  },
  getTypeInfo : function(){
    switch (this.type.toLowerCase()) {
      case 'banana':
        return {points: 50, fill: 5};
      case 'carrot':
        return {points: 35, fill: 3};
      case 'grapes':
        return {points: 75, fill: 7};
      case 'orange':
        return {points: 65, fill: 6};
      case 'tomato':
        return {points: 45, fill: 4};
      default:
        return {points: 25, fill: 2};
    }
  },
};

function pickupType(index){
  switch(index){
    case 0:
      return 'banana';
    case 1:
      return 'cherries';
    case 2:
      return 'carrot';
    case 3:
      return 'grapes';
    case 4:
      return 'orange';
    case 5:
      return 'tomato';
  }
}
