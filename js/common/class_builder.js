function ClassBuilder(name, constructor) {
  if (!constructor) 
    constructor = function() {}
  
  this.name = name;
  this.constructor = constructor;
  
  // При создании объектов будем делать немного магии для правильной инициализации
  var constructEnvelope = function(cb) {
    return function() {
      // TODO: ?? может есть путь лучше? Хотя когда каждый объект имеет уникальный идентификатор внутри всей системы это тоже хорошо
      this._ID = Game.getInstance().getNextId();
      this._GAME = Game.getInstance();
      this._CLASS = cb.name;
      Game.getInstance().addObject(this);
      
      Game.getInstance().getDispatcher().fireEvent('object.created', {object: this, className: cb.name});
      
      // Вызываем методы инициализации всех примесей (конструкторы с параметрами)
      for (var m in cb.foo._DEBUG_MIXINS) {
        cb.foo._DEBUG_MIXINS[m]['constructor'].apply(this, cb.foo._MIXIN_INIT_PARAMS[m]);
      }
      
      // ПОТОМ! Вызываем конструктор с аргументами
      constructor.apply(this, cb.foo.arguments);
    }
  }(this);
  
  window[name] = constructEnvelope;
  this.foo = constructEnvelope;
  this.foo._MIXIN_INIT_PARAMS = [];
  this.foo._DEBUG_MIXINS = {}
  this.foo._DEBUG_METHOD_MIXINS = {}
}

ClassBuilder.fromClassName = function(typeName) {
  var cb = new ClassBuilder(typeName, window[typeName]);
  
  return cb;
}

// TODO: можно ли сделать изолированность и совместимость между миксинами
// К примеру переменные с одиним именем используются в разных миксинах. надо что бы каждый использовал свои переменные
// с другой стороны разные миксины могут использовать переменные с разными именами, надо сделать транслятор из настоящих переменных в миксиновые и назад (возможно ли это вообще??)
// это можно сделать при использовании мета языка для генерации JS кода. При этом можно будет указывать метод какого миксина использовать
ClassBuilder.prototype.addMixin = function(mixinName, constructorParams) {
  var mixin = window[mixinName];
  constructorParams = constructorParams ? constructorParams : [];
  
  this.foo._DEBUG_MIXINS[mixinName] = {};
  var debugMixin = this.foo._DEBUG_MIXINS[mixinName];
  debugMixin['constructor'] = mixin;
  
  for (var p in mixin.prototype) {
    if (this.foo.prototype[p])
      console.log(this.name + " has method '" + p + "' from " + (this.foo._DEBUG_METHOD_MIXINS[p] ? this.foo._DEBUG_METHOD_MIXINS[p] : 'self'))
    
    this.foo.prototype[p] = mixin.prototype[p];
    this.foo._DEBUG_METHOD_MIXINS[p] = mixinName;
    debugMixin[p] = mixin.prototype[p];
    
    this.foo._MIXIN_INIT_PARAMS[mixinName] = constructorParams;
  }
  
  return this;
}

ClassBuilder.prototype.getFoo = function() {
  return this.foo;
}

