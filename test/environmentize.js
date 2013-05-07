var expect = require('expect.js')
  , e12e = require('../');


var ENV = process.env.NODE_ENV || 'test';


function setEnv(env) {
  process.env.NODE_ENV = env;
}


describe('environmentize', function () {
  afterEach(function () {
    // retorna para o ambiente original
    process.env.NODE_ENV = ENV;
  });

  it('is accessible', function () {
    expect(e12e).not.to.be(undefined);
  });


  it('is a function', function () {
    expect(e12e).to.be.a('function');
  });


  it('returns the correct value if a environment-value map is given', function () {
    var map = {
      development : 'foo',
      test : 'baz'
    };

    expect(e12e(map)).to.be('baz');

    setEnv('development');
    expect(e12e(map)).to.be('foo');
  });


  it('returns the correct value for unmatched environments when the "other" key is defined in the map', function () {
    var map = {
      test : 'foo',
      other : 'bar'
    };

    expect(e12e(map)).to.be('foo');
    
    setEnv('production');
    expect(e12e(map)).to.be('bar');

    setEnv('development');
    expect(e12e(map)).to.be('bar');
  });


  it('returns the expected value when production/staging and dev/test values are given', function () {
    expect(e12e('foo', 'bar')).to.be('bar');

    setEnv('production');
    expect(e12e('foo', 'bar')).to.be('foo');
  });


  it('throws an error if only one param is passed and is not an object', function () {
    function doIt() {
      e12e('foo');
    }

    expect(doIt).to.throwError();
  });


  it('throws an error if more than two params are given', function () {
    function doIt() { e12e('foo', 'bar', 'baz'); }

    expect(doIt).to.throwError();
  });

}); // environmentize

