function Timer() {
  this.init();
  
  Timer.prototype.instance = this;
  this.serviceFunction = function(obj) {
    return function() {obj.serve()}
  }(this);
  
  this.services = [];
  this.currentService = null;
  this.status;
  this.nextId = 0;
  
  this.date = new Date();
}

Timer.prototype.init = function() {
  
}


Timer.prototype.getNextId = function() {
  return this.nextId++; 
}

Timer.prototype.start = function() {
  if ('run' == this.status)
    return; 
  
  this.status = 'run';
  this.serve();
}

Timer.prototype.stop = function() {
  this.status = 'pause';
}

Timer.prototype.pause = function() {
  this.stop();
}

Timer.prototype.addService = function(service, timeout) {
  this.services[service.ID] = {
    service: service,
    timeout: timeout ? timeout : 0,
    lastcall: 0
  };
}

Timer.getInstance = function() {
  if (!Timer.prototype.instance) 
    throw new Exception("No game instance created");
  
  return Timer.prototype.instance;
}

Timer.getTimestampMs = function() {
  d = new Date();
  return d.getHours() * 3600000 + d.getMinutes()*60000 + d.getSeconds() * 1000 + d.getMilliseconds();
}

Timer.prototype.serve = function() {
  if ('run' == this.status)
    setTimeout(this.serviceFunction, 10);
  
  var service = null, cur = null, result = null, ms = 0, timeout = 0, lastcall = 0;
  for (s in this.services) {
    cur = this.services[s];
    if (null == cur)
      continue;
    
    ms = Timer.getTimestampMs();
    
    service   = cur.service;
    timeout   = cur.timeout;
    lastcall  = cur.lastcall;
    
    if (timeout > ms - lastcall)
      continue;
      
    if ('function' == typeof(service.serve)) {
      result = service.serve(lastcall == 0 ? 0 : ms - lastcall);
      cur.lastcall = ms;
      if (false === result)
        this.services[s] = null;
      if (true === result)
        continue;
      
      // TODO: переделать на пропуски циклов, а не времени.
      if (0 != (result = parseInt(result)))
        cur.timeout = result;
    }
  }
}