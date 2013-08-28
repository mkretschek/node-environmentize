
0.1.0 / 2013-08-28
==================

Complete rewrite with significant changes to the API.
First version published to the npm registry.

* add: license
* add: documentation in the README file;
* add: `e12e()` for getting the current environment;
* add: `e12e('env')` for checking environment;
* add: `e12e(['env1', 'env2', ...'envN'])` for checking agains multiple
  environments;
* add: `e12e('env', 'env value')` and `e12e('env', 'env value', 'other value')`
  for getting a value for a specific environment;
* add: accept array of environments when setting a value;
* removed: the `'other'` parameter in an environment-value map is no longer
  used to set a fallback value. Now the signature for maps with a fallback
  value is `e12e(map, fallback)`;
* removed: the 2-param signature for production/staging-development/test
  was replaced by the previously described behavior;
* changed: `e12e.env` is set whenever `e12e.setup()` is called. It no
  longer checks `process.env.NODE_ENV` each time it's used;
