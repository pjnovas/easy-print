(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{}],2:[function(require,module,exports){

var Base = require("./Base");

module.exports = Base.extend({

  events: {
      "pressing": null
    , "moving": null
    , "release": null
    , "clickout": null

    , "arrow:on": null
    , "arrow:off": null
    
    , "pause": null
  },

  enabled: false,

  actions: {
    control: false,
    shift: false
  },

  isMouseDown: false,

  start: function(options){
    var doc = window.document
      , c = this.container = options.container || doc;

    c.onmouseup = this._onMouseEvent.bind(this, "release");
    c.onmousedown = this._onMouseEvent.bind(this, "pressing");
    c.onmousemove = this._onMouseEvent.bind(this, "moving");
    doc.addEventListener("keyup", this._onKeyUp.bind(this));
    doc.addEventListener("keydown", this._onKeyDown.bind(this));
  },

  enable: function(){
    this.enabled = true;
    return this;
  },

  disable: function(){
    this.enabled = false;
    return this;
  },

  on: function(evName, callback){
    if (!this.events[evName]){
      this.events[evName] = [];
    }

    this.events[evName].push(callback);

    return this;
  },

  off: function(evName){
    if (this.events[evName]){
      this.events[evName].length = 0;
    }

    return this;
  },

  _getEventName: function(e){
    var key = e.which || e.keyCode;

    switch(key){
      case 37: 
        return "arrow:left";
      case 38:
        return "arrow:up";
      case 39:
        return "arrow:right";
      case 40:
        return "arrow:down";
      case 16:
        return "shift";
    }

    return;
  },

  _onKeyUp: function(e){
    if (!this.enabled){
      return;
    }

    var evName = this._getEventName(e);
    if (evName){

      if (evName === "shift"){
        this.actions.shift = false;
      }

      if (evName.indexOf("arrow") > -1){
        var arrow = evName.split(":")[1];      

        evName = "arrow:off";
        if (this.events[evName]){
          this.events[evName].forEach(function(cb){
            cb(arrow);
          });
        }
      }

      e.preventDefault();
      return false;
    }
  },

  _onKeyDown: function(e){
    if (!this.enabled){
      return;
    }

    var evName = this._getEventName(e);
    if (evName){

      if (evName === "shift"){
        this.actions.shift = true;
      }

      if (evName.indexOf("arrow") > -1){
        var arrow = evName.split(":")[1];      

        evName = "arrow:on";
        if (this.events[evName]){
          this.events[evName].forEach(function(cb){
            cb(arrow);
          });
        }
      }

      e.preventDefault();
      return false;
    }
  },

  _onMouseEvent: function(type, e){
    if (!this.enabled){
      return;
    }

    var pos = this.getCoordsEvent(e, this.container, this.parent);

    switch(type){
      case "pressing":
        this.isMouseDown = true;
        break;
      case "release":
        this.isMouseDown = false;
        break;
    }

    if (type === "release" && e.srcElement.tagName !== "a"){
      if (this.events.clickout){
        this.events.clickout.forEach(function(cb){
          cb();
        });
      }
    }

    if (this.events[type]){
      this.events[type].forEach(function(cb){
        cb(pos);
      });
    }
  },

  getCoordsEvent: function(e, ele, parent){
    var x, y
      , doc = document
      , body = doc.body
      , docEle = doc.documentElement;

    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + body.scrollLeft + docEle.scrollLeft; 
      y = e.clientY + body.scrollTop + docEle.scrollTop; 
    } 
    
    x -= ele.offsetLeft + parent.offsetLeft;
    y -= ele.offsetTop + parent.offsetTop;

    x += parent.scrollLeft;
    y += parent.scrollTop;
    
    return { x: x, y: y };
  }

});

},{"./Base":1}],3:[function(require,module,exports){

var Item = require("./Item");
var TextBox = require("./TextBox");
var TextArea = require("./TextArea");

var Grid = module.exports = Item.extend({

  tagName: "table",
  rows: 1,
  pos: { x: 0, y: 0 },

  cols: [],
  valuesEl: [],

  start: function(){
    Grid._super.start.apply(this, arguments);
    this.buildTable();
  },

  buildTable: function(){
    this.valuesEl = [];

    if (this.bodyEl){
      this.el.removeChild(this.bodyEl);
      this.bodyEl = null;
    }

    var bodyEl = document.createElement("tbody");

    for(var i=0; i<this.rows; i++){
      var rowEl = this.createRowEl();
      bodyEl.appendChild(rowEl);
    }

    this.bodyEl = bodyEl;
    this.el.appendChild(bodyEl);
    this.wrapper.className += " printer-item-table";
  },

  createRowEl: function(){
    var cols = this.cols;
    var rowEl = document.createElement("tr");
    var cellsEl = [];
  
    for(var j=0; j<this.fields.length; j++){
      var field = this.fields[j];
      var cellProps = cols[j];

      var valueEl = document.createElement("td");

      if (cellProps && cellProps.attr){
        for (var attr in cellProps.attr){
          valueEl.setAttribute(attr, cellProps.attr[attr]);
        }
      }

      if (cellProps && cellProps.style){
        for (var css in cellProps.style){
          valueEl.style[css] = cellProps.style[css];
        }
      }

      field.container = valueEl;
      var ele = this.createCellItem(field);
      valueEl.appendChild(ele.el);

      cellsEl.push(ele);

      rowEl.appendChild(valueEl);
    }

    this.valuesEl.push(cellsEl);
    return rowEl;
  },

  createCellItem: function(field){
    var ele;

    field.wrapped = false;

    switch(field.type){
      case "textbox":
        ele = new TextBox(field);
        break;
      case "textarea":
        ele = new TextArea(field);
        break;
    }

    return ele;
  },

  normalizeRows: function(rows){
    this.rows = rows;
    this.buildTable();
  },

  setValue: function(values){

    this.normalizeRows(values.length);

    for(var i=0; i<this.valuesEl.length; i++){
      var row = this.valuesEl[i];
      
      for(var j=0; j<row.length; j++){

        if (values[i].length-1 >= j){
          row[j].setValue(values[i][j]);
        }
      }
    }

  },

  getValue: function(){
    var values = [];

    for(var i=0; i<this.valuesEl.length; i++){
      var row = this.valuesEl[i];
      var rowVal = [];
      
      for(var j=0; j<row.length; j++){
        rowVal.push(row[j].getValue());
      }

      values.push(rowVal);
    }

    return values;
  }

});

},{"./Item":4,"./TextArea":6,"./TextBox":7}],4:[function(require,module,exports){

var Base = require("./Base");

module.exports = Base.extend({

  tagName: "",
  pos: { x: 0, y: 0 },
  attributes: null,
  style: null,
  className: "",

  selected: false,
  wrapped: true,

  start: function(options){
    
    this.template = options;
    delete this.template.container;
    delete this.template.wrapped;

    this.create();

    if (this.wrapped){
      this.attachControls();
    }
  },

  create: function(){
    var wrapper;
    if (this.wrapped){
      wrapper = document.createElement("div");
    }
    var ele = document.createElement(this.tagName || "div");
    ele.id = this.cid;
    ele.className = this.className;

    if (this.attr){
      for (var attr in this.attr){
        ele.setAttribute(attr, this.attr[attr]);
      }
    }

    if (this.style){
      for (var css in this.style){
        ele.style[css] = this.style[css];
      }
    }

    if (this.wrapped){
      wrapper.style.position = "absolute";
      wrapper.style.top = this.pos.y + "px";
      wrapper.style.left = this.pos.x + "px";
      
      if (this.size && this.size.x){
        wrapper.style.width = ele.style.width = this.size.x + "px";
      }
      
      wrapper.style.zIndex = 1;
      wrapper.className = "printer-item";
      
      wrapper.appendChild(ele);
      this.container.appendChild(wrapper);
    }
    else {
      ele.style.width = this.size.x + "px";
      this.container.appendChild(ele); 
    }

    this.el = ele;

    if (this.wrapped){
      this.wrapper = wrapper;
    }
  },

  attachControls: function(){
    var controls = document.createElement("div");
    var moveEl = document.createElement("a");

    controls.className = "printer-item-controls";
    moveEl.className = "printer-item-move";

    controls.appendChild(moveEl);
    this.wrapper.appendChild(controls);

    var self = this;
    moveEl.addEventListener("mousedown", function(){
      self.onPressed();
    });

    moveEl.addEventListener("mouseup", function(){
      self.onReleased();
    });

    this.margin = {
      x: moveEl.offsetLeft + (moveEl.offsetWidth/2) || -10,
      y: moveEl.offsetTop + (moveEl.offsetHeight/2) || -10
    };
  },

  onPressed: function(){},
  onReleased: function(){},

  move: function(inc){
    this.pos.x += inc.x;
    this.pos.y += inc.y;
    this.update();
  },

  setPos: function(newPos){
    this.pos.x = newPos.x - this.margin.x;
    this.pos.y = newPos.y - this.margin.y;
    this.update();
  },

  update: function(){
    this.wrapper.style.top = this.pos.y + "px";
    this.wrapper.style.left = this.pos.x + "px";
  },

  select: function(){
    this.selected = true;
    this.wrapper.className += " selected";
  },

  unselect: function(){
    this.selected = false;
    this.wrapper.className = this.wrapper.className.replace("selected", "");
  },

  getTemplate: function(){
    this.template.pos = { x: this.pos.x, y: this.pos.y };
    return this.template;
  }

});

},{"./Base":1}],5:[function(require,module,exports){


var Base = require("./Base");
var template = require("./template");
var Controls = require("./Controls");

var TextBox = require("./TextBox");
var TextArea = require("./TextArea");
var Grid = require("./Grid");

var modes = ["design", "fill", "print"];

module.exports = Base.extend({

  template: null,
  mode: "design",

  selected: null,
  justSelect: false,

  start: function(options){
    
    if (!options){
      throw new Error("Expected options");
    }

    if (!options.container){
      throw new Error("Expected a 'container'");
    }

    var ready = options.ready || function(){};

    this.holder = (options && options.container) || document.body;

    this.container = document.createElement("div");
    this.container.className = "printer-container";
    this.holder.appendChild(this.container);

    this.template = (options && options.template) || template;
    this.mode = (options && options.mode) || modes[0];
  
    this.container.className += " printer-" + this.mode;
    this.size = this.template.size;

    if (this.template.bg){
      // has a bg, load asych
      var self = this;
      this.loadBackground(function(){
        self.build();
        ready();
      });
    }
    else {
      //no image, go synch
      this.build();
      ready();
    }

    this.bindControls();
  },

  loadBackground: function(ready){
    var self = this;

    var img = new window.Image();
    
    img.onload = function(){
      img.style.position = "absolute";
      img.style.zIndex = 0;

      self.container.appendChild(img);

      if (self.template.useBgSize){      
        self.size = {
          x: img.width,
          y: img.height
        };
      }

      ready();
    };

    img.src = this.template.bg;
  },

  build: function(){
    var items = this.template.items;
    for (var name in items){
      var item = items[name];
      this.createItem(name, item);
    }

    this.container.style.width = this.size.x + "px";
    this.container.style.height = this.size.y + "px";

    //Disable Browser Drags

    function disabled(e){
      e.preventDefault();
      return false;
    }

    this.container.addEventListener("dragstart", disabled);
    this.container.addEventListener("drop", disabled);
  },

  createItem: function(name, options){
    if (!this.items){
      this.items = {};
    }

    var item;
    options.container = this.container;

    switch(options.type){
      case "textbox":
        item = new TextBox(options);
        break;
      case "textarea":
        item = new TextArea(options);
        break;
      case "grid":
        item = new Grid(options);
        break;
    }

    if (item){
      item.onPressed = this.onItemPressed.bind(this, item);
      item.onReleased = this.onItemReleased.bind(this, item);
      this.items[name] = item;
    }
  },

  onItemPressed: function(item){
    for (var name in this.items){
      this.items[name].unselect();
    }
    
    item.select();
    this.selected = item;
    this.justSelect = true;
  },

  onItemReleased: function(/*item*/){
    this.justSelect = false;
  },

  bindControls: function(){
    this.controls = new Controls({
      parent: this.holder,
      container: this.container
    });

    this.axisAcc = { x: 0, y: 0 };

    var self = this;

    this.controls
      .on("arrow:on", function(arrow){
        if (!self.selected){
          return;
        }

        var inc = 1;

        if (self.controls.actions.shift){
          inc = 20;          
        }

        switch(arrow){
          case "left": 
            self.axisAcc.x -= inc;
          break;
          case "right": 
            self.axisAcc.x += inc;
          break;
          case "up": 
            self.axisAcc.y -= inc;
          break;
          case "down": 
            self.axisAcc.y += inc;
          break;
        }

        self.selected.move(self.axisAcc);
      })
      .on("arrow:off", function(arrow){
        switch(arrow){
          case "left": 
          case "right": 
            self.axisAcc.x = 0;
          break;
          case "up": 
          case "down": 
            self.axisAcc.y = 0;
          break;
        }
      })
      .on("pressing", function(){
        if (self.selected && !self.justSelect){
          self.selected.unselect();
          self.selected = null;
        }
      })
      .on("moving", function(pos){
        if (self.controls.isMouseDown && self.selected){
          self.selected.setPos(pos);
        }
      });

    this.controls.enable();    
  },

  fill: function(values){
    for(var name in values){
      var value = values[name];
      if (this.items[name]){
        this.items[name].setValue(value);
      }
    }
  },

  setMode: function(mode){
    var prefix = "printer-";
    this.container.className = this.container.className.replace(prefix + this.mode, "");
    this.mode = mode;
    this.container.className += " " + prefix + this.mode;

    if (this.mode !== "design" && this.selected){
      this.selected.unselect();
      this.selected = null;
    }
  },

  getTemplate: function(){
    var tmpl = {};

    for(var name in this.items){
      var item = this.items[name];
      tmpl[name] = item.getTemplate();
    }

    return tmpl;
  },

  getFill: function(){
    var tmpl = {};

    for(var name in this.items){
      var item = this.items[name];
      tmpl[name] = item.getValue();
    }

    return tmpl;
  }

});

},{"./Base":1,"./Controls":2,"./Grid":3,"./TextArea":6,"./TextBox":7,"./template":9}],6:[function(require,module,exports){

var Item = require("./Item");

var TextBox = module.exports = Item.extend({

  tagName: "textarea",
  pos: { x: 0, y: 0 },

  style: {
    fontSize: "20px"
  },

  start: function(){
    TextBox._super.start.apply(this, arguments);
    this.el.setAttribute("type", "text");

    this.el.addEventListener("keyup", this.resize.bind(this));
    this.resize();
  },

  setValue: function(value){
    this.el.innerText = value.toString();
    this.resize();
  },

  resize: function(){
    if (!this.el.scrollTop){
      var b;
      do {
        b = this.el.scrollHeight;
        var h = parseInt(this.el.style.height.replace("px"), 10);
        this.el.style.height = (h - 1) + "px";
      }
      while(b && (b !== this.el.scrollHeight));
    }

    if (this.el.scrollHeight > 0){
      this.el.style.height = this.el.scrollHeight + "px";
    }
    else {
      this.el.style.height = "20px"; 
    }
  },

  getValue: function(){
    return this.el.innerHTML;
  }

});

},{"./Item":4}],7:[function(require,module,exports){

var Item = require("./Item");

var TextBox = module.exports = Item.extend({

  tagName: "input",
  pos: { x: 0, y: 0 },

  style: {
    fontSize: "20px"
  },

  start: function(){
    TextBox._super.start.apply(this, arguments);
    this.el.setAttribute("type", "text");
  },

  setValue: function(value){
    this.el.value = value.toString();
  },

  getValue: function(){
    return this.el.value;
  }

});

},{"./Item":4}],8:[function(require,module,exports){
(function(){
  window.Printer = require("./Printer");
}());
},{"./Printer":5}],9:[function(require,module,exports){

// Base Template

module.exports = {
  
  bg: null,
  useBgSize: false,
  
  size: {
    width: 900,
    height: 600
  },

  items: {

    example1: {
      type: "input",
      pos: {
        x: 50,
        y: 50
      },
      size: {
        x: 100
      },
      style: {
        color: "blue"
      },
      attr: {
        "data-on": true
      },
      value: "example1"
    }

  }

};
},{}]},{},[8]);
