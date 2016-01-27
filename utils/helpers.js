function lerp(a,b,amount){
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw "Linear interpolation available to numbers only";
  }
  return b - amount*(b-a);
}


function smoothTransition(rgba, rgba2, amount) {

  if (rgba == rgba2) {
    return rgba;
  }

  var c1R = (rgba & 0xff);
  var c1G = ((rgba & 0xff00) >> 8);
  var c1B = ((rgba & 0xff0000) >> 16);
  var c1A = ((rgba & 0xff000000) >>> 24);

  var c2R = (rgba2 & 0xff);
  var c2G = ((rgba2 & 0xff00) >> 8);
  var c2B = ((rgba2 & 0xff0000) >> 16);
  var c2A = ((rgba2 & 0xff000000) >>> 24);


  c1A = c1A > c2A ? c1A - amount < c2A ? c2A : c1A - amount : c1A + amount > c2A ? c2A : c1A + amount;
  c1R = c1R > c2R ? c1R - amount < c2R ? c2R : c1R - amount : c1R + amount > c2R ? c2R : c1R + amount;
  c1G = c1G > c2G ? c1G - amount < c2G ? c2G : c1G - amount : c1G + amount > c2G ? c2G : c1G + amount;
  c1B = c1B > c2B ? c1B - amount < c2B ? c2B : c1B - amount : c1B + amount > c2B ? c2B : c1B + amount;

  var result = c1A << 24 | c1B << 16 | c1G << 8 | c1R;
  return result;
}

function setChannel(source,channel,value){
  if (isNaN(value)) {
    console.error('SetChannel needs valid numeric value.');
    return source;
  }else {
    value = value < 0 ? 0 : value > 255 ? 255 : value;
  }
  var result = source >>> 0;
  switch (channel.toLowerCase()) {
    case 'r':
      result = (result & 0xffffff00) | value;
      console.log(source.toString(16));
      return result;
    case 'g':
      result = (result  & 0xffff00ff) | value << 8;
      return result;
    case 'b':
      result = (result & 0xff00ffff) | value << 16;
      return result;
    case 'a':
      result = (result & 0xffffff) | value << 24;
      return result;
    default:
      return result;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function AARectColiding(rect1,rect2,shrink){

  if (rect1 instanceof Rect && rect2 instanceof Rect) {
    if (!shrink) {
      shrink = 0;
    }
    if (rect1.left < rect2.right - shrink && rect1.right > rect2.left + shrink &&
       rect1.bottom < rect2.top - shrink && rect1.top > rect2.bottom + shrink) {
        return true;
    }else {
      return false;
    }
  }
}

function clamp(value,min,max){
  return value < min ? min : value > max ? max : value;
}
