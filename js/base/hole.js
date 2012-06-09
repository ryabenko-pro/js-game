function Hole(x, y) {
  this.setCoords(x, y);
}

ClassBuilder.fromClassName('Hole').addMixin('Movable', [0]).addMixin('Displayable', [100, 100, 'lightblue']);
