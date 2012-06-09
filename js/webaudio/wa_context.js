function WAContext() {
  this.context = new webkitAudioContext();
  this.buffers = {};
  
  this.countTotal = 0;
  this.countLoaded = 0;
  
  
  WAContext.instance = this;
  
  this.init();
}

WAContext.prototype.playBuffer = function(buffer) {
  var source = this.context.createBufferSource();
  source.buffer = buffer;
  source.connect(this.context.destination);
  source.noteOn(0);
  
  return source;
}

WAContext.prototype.createBufferSource = function() {
  var source = this.context.createBufferSource();
  source.buffer = this.context.createBuffer(NUM_CHANNELS, NUM_SAMPLES, SAMPLE_RATE);
  source.connect(this.context.destination);
  return source;
}

WAContext.prototype.getDestination = function() {
  return this.context.destination;
}



WAContext.prototype.init = function() {
  this.loader = document.createElement('DIV');
  this.loader.style.position = 'fixed';
  this.loader.style.top = '20px';
  this.loader.style.right = '20px';
  this.loader.style['background-image'] = 'url(images/ajax-loader.gif)';
  this.loader.style.width = '16px';
  this.loader.style.height = '16px';
  this.loader.style.display = 'none';
  document.body.appendChild(this.loader);
}

WAContext.getInstance = function() {
  return WAContext.instance;
}

WAContext.prototype.loadBuffer = function(url, listener) {
  this.setBuffer(url, false);
  
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function(context) {
    return function() {
      context.context.decodeAudioData(request.response, function(buffer) {
        context.setBuffer(url, buffer);
        listener(buffer);
      }, function() {
        console.log('Error while loading resource');
      });
    }
  }(this);
  request.send();
}

WAContext.prototype.setBuffer = function(url, buffer) {
  this.buffers[url] = buffer;
  if (false == buffer) {
    this.countTotal++;
  } else {
    this.countLoaded++;
  }
  
  if (this.countTotal == this.countLoaded) {
    this.loader.style.display = 'none';
  } else {
    this.loader.style.display = 'block';
  }
}

