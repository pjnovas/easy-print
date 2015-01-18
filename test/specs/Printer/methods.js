var Printer = require("../../../src/js/Printer");

var chai = require("chai");
var expect = chai.expect;

describe("methods", function(){

  var ctn, content, printer;

  var template = {
    size: { x: 600, y: 400 },
    items: {
      testTextbox: {
        type: "textbox",
        pos: { x: 500, y: 165 },
      },
      testTextArea: {
        type: "textarea",
        pos: { x: 100, y: 200 },
      },
      testGrid: {
        type: "grid",
        pos: { x: 150, y: 20 },

        rows: 3,
        fields: [{
          type: "textbox"
        }, {
          type: "textarea"
        }]

      },
    }
  };

  var values = {
    testTextbox: "some input value",
    testTextArea: "some text inside a text area",
    testGrid: [
      [1, "item 1"],
      [2, "item 2"],
      [3, "item 3"],
    ]
  };

  before(function(){

    ctn = document.createElement("div");
    ctn.id = "test-ctn";

    printer = new Printer({
      container: ctn,
      mode: "print",
      template: template
    });

    content = ctn.querySelector("div");

  });

  describe("#setMode", function(){

    it("must change the mode of the Printer", function(){
      expect(printer.mode).to.be.equal("print");
      expect(content.className.indexOf("printer-print")).to.be.greaterThan(-1);
      expect(printer.controls.editMode).to.be.false;

      printer.setMode("design");

      expect(printer.mode).to.be.equal("design");
      expect(content.className.indexOf("printer-design")).to.be.greaterThan(-1);
      expect(content.className.indexOf("printer-print")).to.be.equal(-1);
      expect(printer.controls.editMode).to.be.true;
    });

  });

  describe("#fill", function(){

    it("must fill controls with values", function(){
      var input = content.querySelector("input[type=text]");
      var textarea = content.querySelector("textarea");
      var table = content.querySelector("table");

      expect(input).to.be.ok;
      expect(textarea).to.be.ok;
      expect(table).to.be.ok;

      expect(input.value).to.be.equal("");
      expect(textarea.value).to.be.equal("");

      printer.fill(values);

      expect(input.value).to.be.equal(values.testTextbox);
      expect(textarea.value).to.be.equal(values.testTextArea);

      var trs = table.querySelectorAll("tbody tr");
      for(var i=0; i<trs.length; i++){
        var tds = trs[i].querySelectorAll("td");

        for(var j=0; j<tds.length; j++){
          var ctrl = tds[j].firstChild;
          expect(ctrl.value).to.be.equal(values.testGrid[i][j].toString());
        }
      }

    });

  });

  describe("#getFill", function(){

    it("must return controls values", function(){
      var input = content.querySelector("input[type=text]");
      var textarea = content.querySelector("textarea");
      var table = content.querySelector("table");

      expect(input).to.be.ok;
      expect(textarea).to.be.ok;
      expect(table).to.be.ok;

      var newValues = {
        testTextbox: "NEW input value",
        testTextArea: "NEW text inside a text area",
        testGrid: [
          [12, "new item 1"],
          [22, "new item 2"],
          [32, "new item 3"],
        ]
      };

      input.value = newValues.testTextbox;
      textarea.value = newValues.testTextArea;

      var trs = table.querySelectorAll("tbody tr");
      for(var i=0; i<trs.length; i++){
        var tds = trs[i].querySelectorAll("td");

        for(var j=0; j<tds.length; j++){
          var ctrl = tds[j].firstChild;
          ctrl.value = newValues.testGrid[i][j];
        }
      }

      var result = printer.getFill();

      expect(result.testTextbox).to.be.equal(newValues.testTextbox);
      expect(result.testTextArea).to.be.equal(newValues.testTextArea);

      newValues.testGrid.forEach(function(row, i){
        row.forEach(function(value, j){
          expect(result.testGrid[i][j]).to.be.equal(value.toString());
        });
      });

    });
  });

  describe("#getTemplate", function(){

    it("must return the updated template items", function(){
      var bounds = { x: 1000, y: 1000};

      function testTemplateUpdate(name, move){
        var lastPos = {
          x: template.items[name].pos.x,
          y: template.items[name].pos.y
        };

        printer.items[name].move(move, bounds);

        var newTemplate = printer.getTemplate();

        var newPos = newTemplate[name].pos;
        expect(newPos.x).to.be.equal(lastPos.x + move.x);
        expect(newPos.y).to.be.equal(lastPos.y + move.y);
      }

      testTemplateUpdate( "testTextbox", { x: 20, y: 10 });
      testTemplateUpdate( "testTextArea", { x: 30, y: 20 });
      testTemplateUpdate( "testGrid", { x: 40, y: 30 });

    });

  });

});