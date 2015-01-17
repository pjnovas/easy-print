var template = {
  bg: "test_bg.png",
  useBgSize: true,

  items: {

    invDate: {
      type: "textbox",
      pos: {
        x: 500,
        y: 165
      },
      size: {
        x: 150
      }
    },

    invTo: {
      type: "textbox",
      pos: {
        x: 180,
        y: 255
      },
      size: {
        x: 550
      },
      style: {
        fontSize: "16px",
        fontWeight: 'bold'
      },
      attr: {
        "data-on": true
      }
    },

    invAddress: {
      type: "textbox",
      pos: {
        x: 180,
        y: 285
      },
      size: {
        x: 550
      },
      style: {
        fontSize: "16px"
      }
    },

    invCUIT: {
      type: "textbox",
      pos: {
        x: 180,
        y: 315
      },
      size: {
        x: 200
      },
      style: {
        fontSize: "16px"
      }
    },

    invIVA: {
      type: "textbox",
      pos: {
        x: 540,
        y: 315
      },
      size: {
        x: 200
      },
      style: {
        fontSize: "16px",
        textTransform: "uppercase"
      }
    },

    invPriceText: {
      type: "textarea",
      pos: {
        x: 110,
        y: 940
      },
      size: {
        x: 350
      },
      style: {
        fontSize: "16px",
        textTransform: "uppercase"
      }
    },

    invTotal: {
      type: "textbox",
      pos: {
        x: 575,
        y: 975
      },
      size: {
        x: 140
      },
      style: {
        fontSize: "20px",
        textAlign: "right",
        fontWeight: 'bold'
      }
    },

    products: {
      type: "grid",
      rows: 3,
      pos: {
        x: 100,
        y: 400
      },
      style: {
        fontSize: "16px"
      },

      cols: [{
        attr: {
          valign: "top"
        }
      }, {
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
      }, {
        type: "textbox",
        size: {
          x: 140
        },
        style: {
          textAlign: "right",
          fontSize: "16px",
          marginLeft: "10px"
        }
      }]
    }

  }
};

var values = {
  invDate: "01 / 01 / 0001",
  invTo: "Some crazy dude",
  invAddress: "742 Evergreen Terrace",
  invCUIT: "60-99666777-9",
  invIVA: "Inscripto",
  invPriceText: "Son Pesos: Quinientos cincuenta y cinco con 20/100.",
  invTotal: "555,20",
  products: [
    [1, "producto 1", 125],
    [2, "producto 2", 20],
    [3, "producto 3 very loooooooooong jasdn jaksnd kjasbdjbsdj ksabdajskbd asjkdbasjdbasjkdb sa", 100],
    [4, "producto 4", 150],
    [5, "producto 5", 2000.15]
  ]
};

(function(){

  var ctn = document.getElementById("ctn");

  var invoiceExample = window.invoiceExample = new window.Printer({
    container: ctn,
    mode: "design",
    template: template,
    ready: function(){
      invoiceExample.fill(values);
    }
  });

  var menuLinks = document.querySelectorAll(".controls a");
  var controls = document.querySelector(".controls");

  function switchMode(e){
    for (var i=0; i<menuLinks.length; i++){
      menuLinks[i].className = "";
    }

    var ele = e.srcElement;
    ele.className = "selected";

    var mode = ele.getAttribute("data-mode");
    invoiceExample.setMode(mode);
  }

  controls.addEventListener("click", switchMode);

})();