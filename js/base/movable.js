function Movable(speed) {
  this.x = 0;
  this.y = 0;
  
  this.deltaX       = 0;
  this.deltaY       = 0;
  // Количество шагов, оставшихся до цели
  this.stepsAmount  = 0;
  
  this.speed        = speed ? speed : 10;
  
  // TODO: сделать через события, наверное
  Game.getInstance().getGeometryObserver().addObject(this);
}

Movable.prototype.setCoords = function(x, y) {
  this.x = x;
  this.y = y;
}

Movable.prototype.isMoving = function() {
  return 0 != this.deltaX || 0 != this.deltaY;
}

Movable.prototype.move = function(x, y) {
  var intersect = this._GAME.getGeometryObserver().getIntersection(this, x, y);
  if (false === this.onIntersection(intersect))
    return false;
  
  this.x = x;
  this.y = y;
  
  this.fireMove(this.x, this.y, x, y);
}

Movable.prototype.onIntersection = function(objects) {
  return true;
}

/**
 * @private
 */
Movable.prototype.fireMove = function(x, y, xNew, yNew) {
  Game.getInstance().getDispatcher().fireEvent('movable.moved', {
    object: this, 
    oldCoords: {
      x: this.x, 
      y: this.y
    }, 
    newCoords: {
      x: xNew, 
      y: yNew
    }
  });
}

Movable.prototype.step = function() {
  // do one step
  this.move(this.x + this.deltaX, this.y + this.deltaY);
  
  if (--this.stepsAmount < 1) {
    this.deltaX = 0;
    this.deltaY = 0;
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.move(this.xTarget, this.yTarget);
    
    this.onReached();
    return false;
  }
  
  return true;
}

Movable.prototype.moveTo = function(x, y) {
  this.xTarget = x;
  this.yTarget = y;
  // calculate direction and steps
  this.deltaX = (x - this.x);
  this.deltaY = (y - this.y);
  var distance = Math.sqrt(this.deltaX*this.deltaX + this.deltaY*this.deltaY);
  this.stepsAmount = Math.floor(distance / this.speed);
  this.deltaX = this.deltaX / this.stepsAmount;
  this.deltaY = this.deltaY / this.stepsAmount;
}

// Достигли цели.
Movable.prototype.onReached = function() {}
