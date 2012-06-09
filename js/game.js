// TODO: Must be parted to dispatcher. 
function Game(canvas) {
  this.canvas = canvas;
  this.width = canvas.offsetWidth;
  this.height = canvas.offsetHeight;
  this.x = canvas.offsetLeft;
  this.y = canvas.offsetTop;
  
  this.init();
  
  Game.prototype.instance = this;
  
  this.evenListeners = [];
  
  this.nextId = 0;
  
  this.objects = {};
  
  this.timer = new Timer();
  this.dispatcher = new Dispatcher();
  this.geometryObserver = new GeometryObserver();
  
  this.timer.addService(this, 20);
}

Game.prototype.addObject = function(object) {
  this.objects[object._ID] = object;
}

Game.prototype.init = function() {
  this.canvas.onclick = function(game) {
    return function(event) {
      game.fireEvent("click", {x: event.clientX, y: event.clientY});
    }
  }(this);
  
  var hidder = document.createElement('div');
  hidder.style.width = '0px';
  hidder.style.height = '0px';
  hidder.style.overflow = 'hidden';
  
  this.input = document.createElement('INPUT');
//  this.input.style.display = 'none';
  hidder.appendChild(this.input);
  this.canvas.appendChild(hidder);
  
  this.input.focus();
  this.input.onblur     = function(input){return function(){input.focus()}}(this.input);
  
  this.input.onkeydown  = function(game){return function(event){game.fireEvent("keydown", {keycode: event.keyCode}); return false;}}(this);
  this.input.onkeyup    = function(game){return function(event){game.fireEvent("keyup", {keycode: event.keyCode}); return false;}}(this);
}


Game.prototype.getNextId = function() {
  return this.nextId++; 
}

Game.prototype.addEventListener = function(event, listener, method) {
  if (!this.evenListeners[event]) {
    this.evenListeners[event] = [];
  }
  
  this.evenListeners[event][listener.ID] = {method: method, listener: listener};
}

Game.prototype.fireEvent = function(event, params) {
  if (!this.evenListeners[event]) {
    return;
  }
  
  var listener, method;
  for (listener_id in this.evenListeners[event]) {
    method = this.evenListeners[event][listener_id]['method'];
    listener = this.evenListeners[event][listener_id]['listener'];
    
    if (listener[method])
      listener[method](params);
  }
}

Game.prototype.start = function() {
  this.timer.start();
}

Game.prototype.pause = function() {
  this.timer.pause();
}

Game.prototype.addService = function(service) {
  this.timer.addService(service);
}

Game.prototype.serve = function() {
  var obj = null;
  for (var o in this.objects) {
    obj = this.objects[o];
    if (obj.think)
      obj.think();
    if (obj.repaint)
      obj.repaint(null);
  }
}

/**
 * @return Dispatcher
 */
Game.prototype.getDispatcher = function() {
  return this.dispatcher;
}

/**
 * @return Timer
 */
Game.prototype.getTimer = function() {
  return this.timer;
}

/**
 * @return GeometryObserver
 */
Game.prototype.getGeometryObserver = function() {
  return this.geometryObserver;
}

Game.getInstance = function() {
  if (!Game.prototype.instance) 
    throw new Exception("No game instance created");
  
  return Game.prototype.instance;
}
