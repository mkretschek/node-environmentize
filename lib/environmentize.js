(function () {
  'use strict';

  /**
   * @fileoverview Defines a helper object for handling configuration
   *  differences between environments.
   * @author Mathias Kretschek <mathias@kretschek.com.br>
   */

  var _ = require('underscore'),
    e12e;


  /**
   * Returns a value based on the environment in which the code is running.
   *
   * If no arguments are passed, returns the current environment.
   *
   * @see README.md for usage details.
   *
   * @param {string|array|object=} opt_a A string naming a matching
   *  environment, an array of matching environments or a map object mapping
   *  environments (keys) to values (value). If the value in the map is a
   *  function, it will be called without arguments and its return value
   *  will be used.
   * @param {*} opt_b The value to be returned if the current
   *  environment is matched or a fallback value in case a value is not
   *  found in the map passed in the first param. If it's a function, it
   *  will be called without arguments and its return value will be used.
   * @param {*} opt_c The fallback value in case the current environment is
   *  not matched by the string or array passed to the first param. Has no
   *  effect if the first param is a map. If it's a function, it will be
   *  called without arguments and its return value will be used.
   *
   * @returns {*} Returns a string indicating the current environment, a
   *  boolean indicating if the current environment was matched or an
   *  appropriate value for the current environment, depending on the
   *  number of params given. See above for more details.
   */
  e12e = function (opt_a, opt_b, opt_c) {
    if (arguments.length === 0) {
      return e12e.env;
    }

    opt_b = (opt_b && typeof opt_b === 'function') ? opt_b() : opt_b;
    opt_c = (opt_c && typeof opt_c === 'function') ? opt_c() : opt_c;

    if (typeof opt_a === 'object' && !Array.isArray(opt_a)) {
      var val = opt_a[e12e.env];
      return val === undefined ? opt_b :
        typeof val === 'function' ? val() : val;
    } else {
      if (arguments.length === 1) {
        return envIs(opt_a);
      }
      return envIs(opt_a) ? opt_b : opt_c;
    }
  };


  /**
   * Environmentize configuration object.
   */
  e12e.settings = {
    /**
    * Array containing all expected environments.
    * @type {Array<string>}
    */
    environments : [
      'development',
      'test',
      'integration',
      'staging',
      'production'
    ],

    /** 
     * The default environment in case `process.env.NODE_ENV` is not
     * defined.
     * @type {string}
     */
    defaultEnv : 'development'
  };


  /**
   * Configures the environmentize function and creates methods for
   * each supported environment.
   *
   * <pre><code>
   * // Creates three methods: `e12e.dev()`, `e12e.ci()` and `e12e.prod()`.
   * e12e.setup({
   *  environments : ['dev', 'ci', 'prod']
   * });
   * </code></pre>
   *
   * It also resets {@code e12e.env} in case the default environment was
   * changed.
   * 
   * @param {object=} opt_options An object that updates the current
   *  options. Note that the options are not reset before updating them.
   *  If an object is not given, will simply recreate the environment
   *  methods.
   */
  e12e.setup = function (opt_options) {
    var s = e12e.settings,
      oldEnvs;

    if (opt_options) {
      removeEnvMethods(s.environments);
      _.extend(s, opt_options);
    }
    createEnvMethods(s.environments);

    e12e.env = process.env.NODE_ENV || s.defaultEnv;
  };


  /**
   * Checks if {@code env} matches the current environment.
   *
   * @param {string|Array<string>} env The environment or array of
   *  environments against which the current environment should be matched.
   * @return {boolean} Whether the current environment matches {@code env}.
   */
  function envIs(env) {
    if (typeof env === 'string') {
      return e12e.env === env;
    } else if (Array.isArray(env)) {
      return !!~env.indexOf(e12e.env);
    }
    return false;
  }


  /**
   * Removes the environment methods for the given environments.
   * @param {Array<string>} envs Array containing the environments whose
   *  methods should be removed.
   */
  function removeEnvMethods(envs) {
    var len, i;
    for (i = 0, len = envs.length; i < len; i += 1) {
      delete e12e[envs[i]];
    }
  }


  /**
   * Creates environment methods for the given environments.
   * @param {Array<string>} envs Array containing environments for whom
   *  methods should be created.
   */
  function createEnvMethods(envs) {
    var env, len, i;
    for (i = 0, len = envs.length; i < len; i += 1) {
      env = envs[i];
      e12e[env] = e12e.bind(null, env);
    }
  }


  // Creates default environment methods and sets `e12e.env`.
  e12e.setup();


  module.exports = e12e;
})();
