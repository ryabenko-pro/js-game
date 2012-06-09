function WANote(src) {
    this.src = src;
    this.ID = src;
    
    this.state = 0;
    this.buffer = null;
    
    this.context = WAContext.getInstance();
    
    this.context.loadBuffer(src, function(note){
      return function(buffer){
        note.setBuffer(buffer);
      }
    }(this));
}

WANote.prototype.setBuffer = function(buffer) {
  this.buffer = buffer;
  this.duration = buffer.duration;
}

WANote.prototype.render = function(element) { }

WANote.prototype.servePlay = function(ms) {
  if (0 == this.state)
    return false;

  this.playTime += ms;
  if (this.playTime > this.duration) {
    this.serve = this.serveStoping;
  }

  if (this.audio.currentTime > 2)
    this.audio.currentTime = 0;
  
  this.audio.volume = Math.max(0, this.audio.volume - 0.05);
  
  return true;
}

WANote.prototype.startPlay = function() {
  this.state = 1;
  this.playTime = 0;
  this.source = this.context.playBuffer(this.buffer);
}

WANote.prototype.stopPlay = function() {
  this.state = 0;
}
