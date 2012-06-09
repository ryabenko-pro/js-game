function GeometryObserver() {
  this.objects = {};
  var listenerMovable = function(go) {
    return function(event, params) {
      go.movableMoved(params);
    }
  }(this);
  
  this.game = Game.getInstance();
  this.game.getDispatcher().addEventListener('movable.moved', listenerMovable);
  this.wall = new Wall();
}

GeometryObserver.prototype.addObject = function(object) {
  this.objects[object._ID] = object;
}

/**
 * С какими объектами объект "столкнется" если сделает это движение
 * 
 * @param object Собственно объект
 * @param x Новая координата x
 * @param y Новая координата y
 */
GeometryObserver.prototype.getIntersection = function(object, x, y) {
  // TODO: объект должен получить список объектов с которыми он будет взаимодействовать при движении в этом направлении
  // Позже объект должен сам решить может он двигаться, и как при этом повлияет на другой объект при движении. 
  // Может пройти сквозь него (к примеру это просто область какая-то по которой можно пройти)
  
  if (x <= this.game.x || y <= this.game.y || x + object.width >= this.game.width + this.game.x || y + object.height >= this.game.y + this.game.height) {
    return [this.wall];
  }
  
  var curObj = null, result = [];
  for (var o in this.objects) {
    curObj = this.objects[o];
    if (curObj === object)
      continue;
    
    if (this.intersects(object, curObj)) {
      result.push(curObj);
    }
  }
  
  return result;
}

GeometryObserver.prototype.intersects = function(object1, object2) {
  var x1 = object2.x, 
    x2 = object2.x + object2.width,
    y1 = object2.y,
    y2 = object2.y + object2.height;
  if (this.isPointInRectangle(object1.x, object1.y, x1, x2, y1, y2))
    return true;
  
  if (this.isPointInRectangle(object1.x + object1.width, object1.y, x1, x2, y1, y2))
    return true;
  
  if (this.isPointInRectangle(object1.x, object1.y + object1.height, x1, x2, y1, y2))
    return true;
  
  if (this.isPointInRectangle(object1.x + object1.width, object1.y + object1.height, x1, x2, y1, y2))
    return true;
  
  return false;
}

GeometryObserver.prototype.isPointInRectangle = function(x, y, x1, x2, y1, y2) {
  if (x > x1 && x < x2 && y > y1 && y < y2)
    return true;
  
  return false;
}

GeometryObserver.prototype.movableMoved = function(object, oldCoords, newCoords) {
  // calculate collision
  // TODO: wtf? calculate before move to ensure object can place there!
  
  // TODO: intersectable cache!!! Keep moved objects to exclude them from cache.
}

