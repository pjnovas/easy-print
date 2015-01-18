
/*
 * Taken from Backbone and Underscore
 * and only left the minimun and necessary code
 */

var _ = {};

var idCounter = 0;
_.uniqueId = function(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
};

_.isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

_.extend = function(obj) {
  if (!_.isObject(obj)) { return obj; }
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
};

// BASE CLASS

var Base = function(attributes) {

  if (_.isObject(attributes)){
    _.extend(this, attributes || {});
  }

  this.cid = _.uniqueId('c');

  this.start.apply(this, arguments);
};

_.extend(Base.prototype, {
  start: function(){},
});

Base.extend = function(protoProps, staticProps) {
  var parent = this;
  var child = function(){ return parent.apply(this, arguments); };

  _.extend(child, parent, staticProps);

  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  if (protoProps) { _.extend(child.prototype, protoProps); }
  child._super = parent.prototype;

  return child;
};

module.exports = Base;
