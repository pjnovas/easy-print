
require('../../src/js');

var expect = require('chai').expect;

describe('Easy Print', function(){

  it('must be accesible as Printer', function(){
    expect(window.Printer).to.be.a('function');
  });

  require('./Printer');

});

