function Dispatcher() {
  this.objects = [];
  this.eventListeners = [];
}

Dispatcher.prototype.foo = function() {
  
}

Dispatcher.prototype.addObject = function(object) {
  this.objects.push = object;
}

Dispatcher.prototype.addEventListener = function(event, listener) {
  if (!this.eventListeners[event])
    this.eventListeners[event] = [];
  
  this.eventListeners[event].push(listener);
}

Dispatcher.prototype.fireEvent = function(name, params) {
  if (!this.eventListeners[name])
    return;
  
  var event = this.eventListeners[name];
  for (var e in event) {
    if ('function' == typeof event[e])
      event[e](params);
    else if ('object' == typeof event[e] && 'function' == typeof event[e]['notify'])
      event[e].notify(name, params);
  }
}

Dispatcher.prototype.foo = function() {

}

Dispatcher.prototype.foo = function() {

}

