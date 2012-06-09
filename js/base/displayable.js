function Displayable(width, height, bgColor) {
  this.width = width ? width : 10;
  this.height = height ? height : 10;
  this.bgColor = bgColor ? bgColor : 10;
  
  this.render();
  this.repaint();
}

Displayable.prototype.repaint = function(canvas) {
  this.div.style.left = Math.floor(this.x) + 'px';
  this.div.style.top = Math.floor(this.y) + 'px';
}

Displayable.prototype.render = function() {
  var div = document.createElement('DIV');
  div.style.position = 'absolute';
  div.style.width = this.width + 'px';
  div.style.height = this.height + 'px';
  div.style.backgroundColor = this.bgColor;
  
  document.body.appendChild(div);
  this.div = div;
}
