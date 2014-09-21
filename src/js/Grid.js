
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
    var cols = this.cols;

    var bodyEl = document.createElement("tbody");

    for(var i=0; i<this.rows; i++){
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
      bodyEl.appendChild(rowEl);
    }

    this.el.appendChild(bodyEl);
    this.wrapper.className += " printer-item-table";
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

  setValue: function(values){

    for(var i=0; i<this.valuesEl.length; i++){
      var row = this.valuesEl[i];
      
      if (values.length-1 >= i){

        for(var j=0; j<row.length; j++){

          if (values[i].length-1 >= j){
            row[j].setValue(values[i][j]);
          }
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
