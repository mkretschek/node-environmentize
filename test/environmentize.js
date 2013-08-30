/* global describe: true, it: true, before: true, after: true */

(function () {
  'use strict';

  var expect = require('expect.js'),
    e12e = require('../');


  describe('environmentize', function () {
    it('is accessible', function () {
      expect(e12e).not.to.be(undefined);
    });


    it('is a function', function () {
      expect(e12e).to.be.a('function');
    });


    it('has a default environment set', function () {
      expect(e12e.settings.environments).to.be.an('array');
      expect(e12e.settings.environments).to.be.eql([
        'development',
        'test',
        'integration',
        'staging',
        'production'
      ]);
    });


    it('has environment methods set', function () {
      var envs = e12e.settings.environments,
        len, i;
      for (i = 0, len = envs.length; i < len; i += 1) {
        expect(e12e).to.have.property(envs[i]);
        expect(e12e[envs[i]]).to.be.a('function');
      }
    });


    it('returns the current environment if called without arguments',
      function () {
        expect(e12e()).to.be(e12e.env);
      });


    it('returns a boolean if the first argument is a string or array',
      function () {
        expect(e12e(e12e.env)).to.be(true);
        expect(e12e(['foo', e12e.env])).to.be(true);
        expect(e12e('foo')).to.be(false);
        expect(e12e(['foo', 'bar'])).to.be(false);
      });


    it('works with an object representing an env-value map', function () {
      var foo = e12e({
        'development' : 'development foo',
        'production' : 'production foo'
      }, 'other foo');

      switch (e12e.env) {
      case 'development':
        expect(foo).to.be('development foo');
        break;
      case 'production':
        expect(foo).to.be('production foo');
        break;
      default:
        expect(foo).to.be('other foo');
      }
    });


    it('accepts a string + value combination as params', function () {
      var foo = e12e('production', 'production foo', 'other foo');

      switch (e12e.env) {
      case 'production':
        expect(foo).to.be('production foo');
        break;
      default:
        expect(foo).to.be('other foo');
      }
    });


    it('accepts an array of strings to map a single value to multiple envs',
      function () {
        var foo = e12e(['staging', 'production'],
          'staging and production foo',
          'other foo');

        switch (e12e.env) {
        case 'production':
          expect(foo).to.be('staging and production foo');
          break;
        case 'staging':
          expect(foo).to.be('staging and production foo');
          break;
        default:
          expect(foo).to.be('other foo');
        }
      });


    it('if value is a function, uses its return value, not the function itself',
      function () {
        var foo = e12e(
          'integration',
          function () { return 'integration foo'; },
          function () { return 'other foo'; }
        );

        switch (process.env.NODE_ENV) {
        case 'integration':
          expect(foo).to.be('integration foo');
          break;
        default:
          expect(foo).to.be('other foo');
        }
      });


    it('exposes an env property', function () {
      expect(e12e.env).not.to.be(undefined);
      expect(e12e.env).to.be.a('string');
      expect(e12e.env).to.be(process.env.NODE_ENV);
    });


    it('exposes a settings property', function () {
      expect(e12e.settings).not.to.be(undefined);
      expect(e12e.settings).to.be.an('object');
    });


    describe('#setup()', function () {
      var settingsO, settingsX;

      settingsO = {
        environments : e12e.settings.environments,
        defaultEnv : e12e.settings.defaultEnv
      };

      settingsX = {
        environments : ['dev', 'ci', 'prod'],
        defaultEnv : 'dev'
      };


      before(function () {
        e12e.setup(settingsX);
      });


      after(function () {
        e12e.setup(settingsO);
      });


      it('is accessible', function () {
        expect(e12e.setup).not.to.be(undefined);
      });


      it('is a function', function () {
        expect(e12e.setup).to.be.a('function');
      });


      it('updates the environments list', function () {
        expect(e12e.settings.environments).not.to.be(settingsO.environments);
        expect(e12e.settings.environments).to.be.eql(settingsX.environments);
      });


      it('updates the default environment', function () {
        expect(e12e.settings.defaultEnv).not.to.be(settingsO.defaultEnv);
        expect(e12e.settings.defaultEnv).to.be(settingsX.defaultEnv);
      });


      it('removes the previous environment methods', function () {
        var len, i;
        for (i = 0, len = settingsO.environments.length; i < len; i += 1) {
          expect(e12e).not.to.have.property(settingsO.environments[i]);
        }
      });


      it('creates new environment methods', function () {
        var envs, env, len, i;
        envs = e12e.settings.environments;
        for (i = 0, len = envs.length; i < len; i += 1) {
          env = envs[i];
          expect(e12e).to.have.property(env);
          expect(e12e[env]).to.be.a('function');
        }
      });
    });


    describe('environment method', function () {
      it('is accessible', function () {
        var envs, len, i;
        envs = e12e.settings.environments;
        for (i = 0, len = envs.length; i < len; i += 1) {
          expect(e12e[envs[i]]).not.to.be(undefined);
        }
      });


      it('is a function', function () {
        var envs, len, i;
        envs = e12e.settings.environments;
        for (i = 0, len = envs.length; i < len; i += 1) {
          expect(e12e[envs[i]]).to.be.a('function');
        }
      });


      it('checks the current environment if no arguments are given',
        function () {
          var envs, env, len, i;
          envs = e12e.settings.environments;
          for (i = 0, len = envs.length; i < len; i += 1) {
            env = envs[i];
            if (env === e12e.env) {
              expect(e12e[env]()).to.be.ok();
            } else {
              expect(e12e[env]()).not.to.be.ok();
            }
          }
        });


      it('returns a value if arguments are passed', function () {
        var envs, env, len, i;
        envs = e12e.settings.environments;
        for (i = 0, len = envs.length; i < len; i += 1) {
          env = envs[i];
          if (env === e12e.env) {
            expect(e12e[env]('foo', 'bar')).to.be('foo');
          } else {
            expect(e12e[env]('foo', 'bar')).to.be('bar');
          }
        }
      });
    });
  });
})();
