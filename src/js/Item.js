
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
