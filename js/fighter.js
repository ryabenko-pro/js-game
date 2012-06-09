function Fighter(x, y) {
  this.x = x;
  this.y = y;
  
  this.lastHit = 0;
  this.lastWater = 0;
  // this.render();
  // this.move(100, 100);
  
  this.deltaX       = 0;
  this.deltaY       = 0;
  this.stepsAmount  = 0;
  
  this.speed = 2;
  this.game = Game.getInstance();
//  this.game.addEventListener("click", this, "moveTo");
  this.game.addEventListener("click", this, "shutTo");
  this.game.getGeometryObserver().addObject(this);
  
  // Common part for all services
  this.ID = Game.getInstance().getNextId();
  
  // Move to base class
  this.nullFunction = function() {}
  
  this.kickSound = new WANote('sounds/drum-kick.mp3');
  this.waterSound = new WANote('sounds/water_converted.mp3');
  this.sounds = [
    null,
    new WANote('sounds/blind_converted.mp3'),
    null,
    new WANote('sounds/moron_converted.mp3'),
    null,
    new WANote('sounds/wall_converted.mp3'),
    null
  ];
}


ClassBuilder.fromClassName('Fighter').addMixin('Movable', [2]).addMixin('Displayable', [10, 10, 'red']);

Fighter.prototype.onIntersection = function(objects) {
  for (var o in objects) {
    if ('Hole' == objects[o]._CLASS) {
      var game = this._GAME;
      this.stepOnWater();
      game.getDispatcher().fireEvent('mob.reached-point', {mob: this});
      return true;
    }
    if ('Wall' == objects[o]._CLASS) {
      var game = this._GAME;
      this.hitWall();
      this.stop();
      game.getDispatcher().fireEvent('fighter.meet-wall', {fighter: this});
      return false;
    }
  }
  
  return true;
}

Fighter.prototype.stepOnWater = function() {
  if (Date.now()-this.lastWater < 5000)
    return; 
    
  console.log('Step on water');
  this.lastWater = Date.now(); 
 
  this.waterSound.startPlay();  
}

Fighter.prototype.hitWall = function() {
  if (Date.now()-this.lastHit < 1000)
    return; 
    
  console.log('hit wall!');
  this.lastHit = Date.now();
  
  this.kickSound.startPlay();

  var sound = this.sounds[Math.floor(Math.random() * this.sounds.length)];
  if (sound)
    sound.startPlay();
}

Fighter.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
  
  this.div.style.left = Math.floor(x) + 'px';
  this.div.style.top = Math.floor(y) + 'px';
}

Fighter.prototype.stop = function() {
  this.stepsAmount = 0;
  this.deltaX = 0;
  this.deltaY = 0;
}

Fighter.prototype.step = function() {
  var intersect = this._GAME.getGeometryObserver().getIntersection(this, this.x + this.deltaX, this.y + this.deltaY);
  if (false === this.onIntersection(intersect)) {
    this.stop();
    this.move(this.x - this.deltaX, this.y - this.deltaY);
    
    return false;
  }
  
  // do one step
  this.move(this.x + this.deltaX, this.y + this.deltaY);
      
  if (--this.stepsAmount < 1) {
    this.deltaX = 0;
    this.deltaY = 0;
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.move(this.x, this.y);
    
    return false;
  }
  
  return true;
}

Fighter.prototype.shutTo = function(params) {
  var shell = new Shell(this.x, this.y);
  shell.shutTo(params.x, params.y);
}

Fighter.prototype.moveTo = function(params) {
  this.game.addService(this);
  // calculate direction and steps
  this.deltaX = (params.x - this.x);
  this.deltaY = (params.y - this.y);
  var distance = Math.sqrt(this.deltaX*this.deltaX + this.deltaY*this.deltaY);
  this.stepsAmount = Math.floor(distance / this.speed);
  this.deltaX = this.deltaX / this.stepsAmount;
  this.deltaY = this.deltaY / this.stepsAmount;
}

Fighter.prototype.serve = function() {
  return this.step();
}

Fighter.prototype.render_ = function() {
  var div = document.createElement('DIV');
  div.style.position = 'absolute';
  div.style.width = '10px';
  div.style.height = '10px';
  div.style.backgroundColor = 'red';
  
  document.body.appendChild(div);
  this.div = div;
}

// MOVE TO PARENT CLASS
Fighter.prototype.getHandler = function(object, event) {
  return this.nullFunction;
}

Fighter.prototype.notify = function(event, params) {
  this.getHandler(this, event)(params);
}




function Shell(x, y) {
  this.x = x;
  this.y = y;
  
  this.deltaX       = 0;
  this.deltaY       = 0;
  this.stepsAmount  = 0;
  this.speed = 30;
  
  this.render();
  this.move(x, y);
  
  this.game = Game.getInstance();
  this.ID = this.game.getNextId();
}

Shell.prototype.render = function() {
  var div = document.createElement('DIV');
  div.style.position = 'absolute';
  div.style.width = '5px';
  div.style.height = '5px';
  div.style.backgroundColor = 'black';
  
  document.body.appendChild(div);
  this.div = div;
}

Shell.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
  
  this.div.style.left = Math.floor(x) + 'px';
  this.div.style.top = Math.floor(y) + 'px';
}

Shell.prototype.serve = function() {
  // do one step
  this.move(this.x + this.deltaX, this.y + this.deltaY);
  
  if (--this.stepsAmount < 1) {
    this.deltaX = 0;
    this.deltaY = 0;
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.move(this.x, this.y);
    
    this.serve = function(shell) {
      return function() {
        shell.div.parentNode.removeChild(shell.div);
        shell = null;
        
        return false;
      }
    }(this);
  }
  
  return true;
}


Shell.prototype.shutTo = function(x, y) {
  // TODO: delete copypast. Make base class movableObject
  // calculate direction and steps
  this.deltaX = (x - this.x);
  this.deltaY = (y - this.y);
  var distance = Math.sqrt(this.deltaX*this.deltaX + this.deltaY*this.deltaY);
  this.stepsAmount = Math.floor(distance / this.speed);
  this.deltaX = this.deltaX / this.stepsAmount;
  this.deltaY = this.deltaY / this.stepsAmount;
  
  this.game.addService(this);
}






function KeyboarObserver(obj) {
  this.obj = obj;
  this.game = Game.getInstance()
  
  this.deltaX = 0;
  this.deltaY = 0;
  
  this.game.addEventListener("keyup", this, "keyup");
  this.game.addEventListener("keydown", this, "keydown");
  
  this.ID = this.game.getNextId();
}

KeyboarObserver.prototype.serve = function() {
  if (0 == this.deltaX && 0 == this.deltaY)
    return true;
  
  this.obj.moveTo({x: this.obj.x + this.deltaX, y: this.obj.y + this.deltaY});
  
  return true;
}

KeyboarObserver.prototype.keydown = function(params) {
  var key = params.keycode;
  console.log("CC down: " + key);
  this.game.addService(this);
  //  a: 65, s: 83, w: 87, d: 68
  if (65 == key)
    this.deltaX = -this.obj.speed;
  if (68 == key)
    this.deltaX = this.obj.speed;
  if (83 == key)
    this.deltaY = this.obj.speed;
  if (87 == key)
    this.deltaY = -this.obj.speed;
}

KeyboarObserver.prototype.keyup = function(params) {
  var key = params.keycode;
  console.log("CC down: " + key);
  if (65 == key)
    this.deltaX = 0;
  if (68 == key)
    this.deltaX = 0;
  if (83 == key)
    this.deltaY = 0;
  if (87 == key)
    this.deltaY = 0;
}
