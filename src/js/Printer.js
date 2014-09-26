

var Base = require("./Base");
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

    if (!options.template){
      throw new Error("Expected a 'template'");
    }    

    var ready = options.ready || function(){};

    this.holder = (options && options.container) || document.body;

    this.container = document.createElement("div");
    this.container.className = "printer-container";
    this.holder.appendChild(this.container);

    this.template = options.template;
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

        self.selected.move(self.axisAcc, self.size);
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
    this.controls.editMode = (this.mode === "design" ? true : false);
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

    this.controls.editMode = (this.mode === "design" ? true : false);
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
