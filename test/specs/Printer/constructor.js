var Printer = require("../../../src/js/Printer");

var chai = require("chai");
var expect = chai.expect;

describe("constructor", function(){

  it("must throw an error if no options", function(){

    expect(function(){
      var printer = new Printer();
    }).to.throw("EasyPrint: Expected options");

  });

  it("must throw an error if no container", function(){

    expect(function(){
      var printer = new Printer({
        container: null,
        mode: "design",
      });
    }).to.throw("EasyPrint: Expected a 'container'");

  });

  it("must throw an error if no template", function(){

    expect(function(){
      var printer = new Printer({
        container: document.body,
        mode: "design"
      });
    }).to.throw("EasyPrint: Expected a 'template'");

  });

  it("must create a printer and call ready", function(){

    var ctn = document.createElement("div");
    ctn.id = "test-ctn";

    var template = {
      size: { x: 100, y: 200 },
      items: { }
    };

    var called = 0;

    var printer = new Printer({
      container: ctn,
      mode: "design",
      template: template,
      ready: function(){
        called++;

        var content = ctn.querySelector("div");
        expect(content.className.indexOf("printer-container"))
          .to.be.greaterThan(-1);
        expect(content.className.indexOf("printer-design"))
          .to.be.greaterThan(-1);
      }
    });

    expect(called).to.be.equal(1);
    expect(printer.mode).to.be.equal("design");
    expect(printer.size).to.be.equal(template.size);

  });

  it("must create a printer and call ready when image is loaded"
    , function(done){

    var ctn = document.createElement("div");
    ctn.id = "test-ctn";

    var testImage = "test_bg.png";

    var template = {
      bg: testImage,
      useBgSize: true,
      items: { }
    };

    var img = new Image();
    img.onload = function(){

      var printer = new Printer({
        container: ctn,
        mode: "fill",
        template: template,
        ready: function(){
          expect(printer.mode).to.be.equal("fill");

          expect(printer.size.x).to.be.equal(img.width);
          expect(printer.size.y).to.be.equal(img.height);

          done();
        }
      });

    };

    img.src = testImage;
  });

  it("must create a printer with an image and a custom size", function(done){

    var ctn = document.createElement("div");
    ctn.id = "test-ctn";

    var testImage = "test_bg.png";

    var template = {
      bg: testImage,
      useBgSize: false,
      size: { x: 100, y: 200 },
      items: { }
    };

    var img = new Image();
    img.onload = function(){

      var printer = new Printer({
        container: ctn,
        mode: "print",
        template: template,
        ready: function(){
          expect(printer.mode).to.be.equal("print");

          expect(printer.size.x).to.be.equal(template.size.x);
          expect(printer.size.y).to.be.equal(template.size.y);

          done();
        }
      });

    };

    img.src = testImage;
  });

  describe("Template Controls", function(){

    var ctn, content, printer;

    var template = {
      size: { x: 600, y: 400 },
      items: {
        testTextbox: {
          type: "textbox",
          pos: { x: 500, y: 165 },
          size: { x: 150 },
          className: "input-class-css",
          style: { fontSize: "16px", fontWeight: "bold" },
          attr: { "data-on": true }
        },
        testTextArea: {
          type: "textarea",
          pos: { x: 100, y: 200 },
          size: { x: 200 },
          className: "textarea-class-css",
          style: { color: "red" },
          attr: { "data-big-one": "yes" }
        },
        testGrid: {
          type: "grid",
          pos: { x: 150, y: 20 },
          size: { x: 200 },
          className: "table-class-css",
          style: { backgroundColor: "blue" },
          attr: { "data-big-table": "none" },

          rows: 3,
          cols: [{
            attr: {
              valign: "top"
            }
          }, {
            attr: {
              valign: "bottom"
            }
          }],
          fields: [{
            type: "textbox",
            size: {
              x: 30
            },
            style: {
              fontSize: "16px"
            }
          }, {
            type: "textarea",
            size: {
              x: 410
            },
            style: {
              fontSize: "16px",
              marginRight: "10px"
            }
          }]

        },
      }
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

    function checkWrapper(ctrl, tCtrl){
      var wrapper = ctrl.parentNode;
      expect(wrapper.className.indexOf("printer-item")).to.be.greaterThan(-1);

      expect(wrapper.style.position).to.be.equal("absolute");
      expect(wrapper.style.left).to.be.equal(tCtrl.pos.x + "px");
      expect(wrapper.style.top).to.be.equal(tCtrl.pos.y + "px");
      expect(wrapper.style.width).to.be.equal(tCtrl.size.x + "px");
    }

    it("must create an input[type=text] for TextBox", function(){

      var tCtrl = template.items.testTextbox;
      var input = content.querySelector("input[type=text]");
      expect(input).to.be.ok;

      checkWrapper(input, tCtrl);

      expect(input.className).to.be.equal(tCtrl.className);

      expect(input.style.fontSize).to.be.equal(tCtrl.style.fontSize);
      expect(input.style.fontWeight).to.be.equal(tCtrl.style.fontWeight);

      expect(input.getAttribute("data-on"))
        .to.be.equal(tCtrl.attr["data-on"].toString());
    });

    it("must create a textarea for TextArea", function(){

      var tCtrl = template.items.testTextArea;
      var textarea = content.querySelector("textarea");
      expect(textarea).to.be.ok;

      checkWrapper(textarea, tCtrl);

      expect(textarea.className).to.be.equal(tCtrl.className);
      expect(textarea.style.color).to.be.equal(tCtrl.style.color);

      expect(textarea.getAttribute("data-big-one"))
        .to.be.equal(tCtrl.attr["data-big-one"].toString());
    });

    it("must create a table for Grid", function(){

      var tCtrl = template.items.testGrid;
      var table = content.querySelector("table");
      expect(table).to.be.ok;

      checkWrapper(table, tCtrl);

      var wrapper = table.parentNode;
      expect(wrapper.className.indexOf("printer-item-table"))
        .to.be.greaterThan(-1);

      expect(table.className).to.be.equal(tCtrl.className);
      expect(table.style.backgroundColor)
        .to.be.equal(tCtrl.style.backgroundColor);

      expect(table.getAttribute("data-big-table"))
        .to.be.equal(tCtrl.attr["data-big-table"].toString());

      var trs = table.querySelectorAll("tbody tr");
      expect(trs.length).to.be.equal(tCtrl.rows);

      for(var i=0; i<trs.length; i++){
        var tr = trs[i];
        var tds = tr.querySelectorAll("td");
        expect(tds.length).to.be.equal(tCtrl.cols.length);

        for(var j=0; j<tds.length; j++){
          var td = tds[j];
          expect(td.getAttribute("valign"))
            .to.be.equal(tCtrl.cols[j].attr.valign);

          var child = td.firstChild;
          switch(tCtrl.fields[j].type){
            case "textbox":
              expect(child.tagName.toLowerCase()).to.be.equal("input");
              break;
            case "textarea":
              expect(child.tagName.toLowerCase()).to.be.equal("textarea");
              break;
            default:
              expect(true).to.be.false;
              break;
          }
        }
      }
    });

  });

});