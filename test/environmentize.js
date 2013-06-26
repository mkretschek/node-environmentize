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


  describe('#env', function () {
    it('is accessible', function () {
      expect(e12e.env).not.to.be(undefined);
    });


    it('returns the current environment', function () {
      expect(e12e.env).to.be('test');
      setEnv('production');
      expect(e12e.env).to.be('production');
    });
  }); // #env

  
  describe('#isProduction()', function () {
    it('is accessible', function () {
      expect(e12e.isProduction).not.to.be(undefined);
    });


    it('is a function', function () {
      expect(e12e.isProduction).to.be.a('function');
    });


    it('returns true in production environment', function () {
      setEnv('production');
      expect(e12e.isProduction()).to.be(true);
    });


    it('returns false if not in production environment', function () {
      setEnv('other');
      expect(e12e.isProduction()).to.be(false);
    });
  }); // #isProduction
  
  
  describe('#isDevelopment()', function () {
    it('is accessible', function () {
      expect(e12e.isDevelopment).not.to.be(undefined);
    });


    it('is a function', function () {
      expect(e12e.isDevelopment).to.be.a('function');
    });


    it('returns true in development environment', function () {
      setEnv('development');
      expect(e12e.isDevelopment()).to.be(true);
    });


    it('returns false if not in development environment', function () {
      setEnv('other');
      expect(e12e.isDevelopment()).to.be(false);
    });
  }); // #isDevelopment()
  
  
  describe('#isTest()', function () {
    it('is accessible', function () {
      expect(e12e.isTest).not.to.be(undefined);
    });


    it('is a function', function () {
      expect(e12e.isTest).to.be.a('function');
    });


    it('returns true in test environment', function () {
      setEnv('test');
      expect(e12e.isTest()).to.be(true);
    });


    it('returns false if not in test environment', function () {
      setEnv('other');
      expect(e12e.isTest()).to.be(false);
    });
  }); // #isTest()
  
  
  describe('#isStage()', function () {
    it('is accessible', function () {
      expect(e12e.isStage).not.to.be(undefined);
    });


    it('is a function', function () {
      expect(e12e.isStage).to.be.a('function');
    });


    it('returns true in stage environment', function () {
      setEnv('stage');
      expect(e12e.isStage()).to.be(true);
    });


    it('returns false if not in stage environment', function () {
      setEnv('other');
      expect(e12e.isStage()).to.be(false);
    });
  }); // #isStage()


  describe('#setup()', function () {
    var express = require('express');


    it('is accessible', function () {
      expect(e12e.setup).not.to.be(undefined);
    });


    it('is a function', function () {
      expect(e12e.setup).to.be.a('function');
    });


    it('sets the `e12e` property in an express.js app locals', function () {
      var app = express();

      expect(app.locals).not.to.have.property('e12e');

      e12e.setup(app);
      expect(app.locals).to.have.property('e12e');
    });


    it('creates a simplified object in locals', function () {
      var app = express();
      e12e.setup(app);

      // The app.locals' e12e object should not be a function
      expect(app.locals.e12e).to.be.an('object');
      expect(app.locals.e12e).not.to.be(e12e);

      // app.locals' e12e should have an `env` object like the regular e12e
      expect(app.locals.e12e).to.have.property('env');
      expect(app.locals.e12e.env).to.be(e12e.env);

      // app.locals' e12e should not have a setup method
      expect(app.locals.e12e).not.to.have.property('setup');
    });


    it('requires an object with a locals property', function () {
      function fail() { e12e.setup({}); }
      expect(fail).to.throwError();
    });
  }); // #setup()

}); // environmentize

