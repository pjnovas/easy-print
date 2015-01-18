
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
    this.el.value = value.toString();
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
    return this.el.value;
  }

});
