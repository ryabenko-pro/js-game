function Mob() {
  this.setCoords(400, 40);
  this.moveTo(1000, 100);
}

ClassBuilder.fromClassName('Mob').addMixin('Movable', [2]).addMixin('Displayable', [10, 10, 'red']);

// При пересечении с другими объектами
Mob.prototype.onIntersection = function(objects) {
  for (var o in objects) {
    if ('Hole' == objects[o]._CLASS) {
      var game = this._GAME;
      game.getDispatcher().fireEvent('mob.reached-point', {mob: this});
      return true;
    }
  }
  
  return true;
}

// TODO: убрать это отсюда нафиг!!! репейнт вынести в отдельный поток
Mob.prototype.think = function() {
  // Deligate to Movable mixin
  if (!this.isMoving())
    return false;
  
  // Movable
  this.step();
  
  return true;
}