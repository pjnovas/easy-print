
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
  editMode: false,

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
    if (!this.enabled || !this.editMode){
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
    if (!this.enabled || !this.editMode){
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
    if (!this.enabled || !this.editMode){
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
