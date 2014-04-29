0.1.6 / 2014-04-29
==================

* fixed: restored support for Node 0.8. It turned out to be just an issue
  with npm and versions starting with '^'.


0.1.5 / 2014-04-28
==================

* changed: moved from Makefile to Gruntfile, since it was being quite
  troublesome to work with `make` in Windows environments.
* dropped: official support for Node 0.8.


0.1.4 / 2013-09-16
==================

* fixed: tests now run without errors if NODE_ENV is not set.
* fixed: updated dependencies versions.


0.1.3 / 2013-08-30
==================

* fixed: functions passed as values are no longer executed regardless of
  the environment. Updated code and tests.


0.1.2 / 2013-08-30
==================

* fixed: cleaned up an unused variable.
* updated: CHANGELOG.md


0.1.1 / 2013-08-30
==================

* fixed: environment methods were not being created and tests were missing
  it. Fixed both code and tests.


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
