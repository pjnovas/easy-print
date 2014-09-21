
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
