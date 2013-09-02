environmentize (e12e)
=====================

Utilities for handling value and behavior differences between environments.

[![Build Status](https://travis-ci.org/mkretschek/node-environmentize.png?branch=master)](https://travis-ci.org/mkretschek/node-environmentize)
[![NPM version](https://badge.fury.io/js/environmentize.png)](http://badge.fury.io/js/environmentize)
[![Dependency Status](https://gemnasium.com/mkretschek/node-environmentize.png)](https://gemnasium.com/mkretschek/node-environmentize)

`environmentize` helps you to set different values for each environment
your code runs in. For example, you probably have different database
settings for each environment or you probably want to use an analytics
code only in production. `environmentize` helps you getting it done:

```javascript
config.DB_HOST = e12e({
  production : '123.456.789.3',
  staging : '123.456.789.4'
}, '127.0.0.1');

config.ANALYTICS_ID = e12e.production('X-12345-6', null);
```

Or maybe there's some code you want to run only while in development:

```javascript
e12e.development(function () {
  // This will run only if you are in development.
  console.log('This is the development environment.');
});
```


Installation
------------

Install from NPM:

    npm install environmentize


Usage
-----

Require it:

```js
var e12e = require('environmentize');
```

Get the current environment:

```js
e12e(); // 'development'
// or
e12e.env; // 'development'
```

`environmentize` will use the `NODE_ENV` environment variable
to get the environment in which the code is running. You shouldn't ever
need to change `e12e.env` yourself.

By default, environmentize sets five environments: `'development'`, `'test'`,
`'integration'`, `'staging'` and `'production'`. If you have a different
environment structure, you can change them using
[`e12e.setup()`](#configuration). The following examples assume we continue
in the `'development'` environment.

Check if the code is being run in a given environment:

```js
e12e('development'); // true
e12e('integration'); // false

// You may use an array of environments as well
e12e(['test', 'development']); // true
e12e(['staging', 'production']); // false
```

Get a value from an environment-value map:

```js
e12e({
  development : 'foo',
  production : 'bar'
}); // 'foo'

e12e({
  integration : 'foo',
  production : 'bar'
}); // undefined

// You can set a fallback value
e12e({
  integration : 'foo',
  production : 'bar'
}, 'baz'); // 'baz'
```

Get a value for a specific environment:

```js
e12e('development', 'foo'); // 'foo'
e12e('integration', 'foo'); // undefined

// With a fallback
e12e('integration', 'foo', 'bar'); // 'bar'

// This works with multiple environments too
e12e(['test', 'development'], 'foo'); // 'foo'
e12e(['staging', 'production'], 'foo'); // undefined
e12e(['staging', 'production'], 'foo', 'bar'); // 'bar'
```

Values may be functions, in which case they are called without arguments
and the returned value is used:

```js
e12e('development', function () { return 'foo'; }); // 'foo'

// Works for fallbacks too
e12e('integration', function () { return 'foo'; }, function () { return 'bar'; }); // 'bar'

// And for values in an environment-value map
e12e({
  development : function () { return 'foo'; }
}); // 'foo'
```

This way you can run a piece of code only in certain environments:

```js
e12e('development', function () {
  // Do something that should only be done during development.
  console.log('This is the development environment');
});
```

Environmentize also sets a method for each environment, which avoids the
need for the first argument in some cases:

```js
e12e.development('foo'); // 'foo'
e12e.integration('foo', 'bar'); // 'bar'
```

This might be handy if you need to run some code only in a specific 
environment:

```js
e12e.production(function () {
  // This code will run only in production.
  app.use(toobusy());
});
```


Configuration   {#configuration}
-------------

You can use your own environment definitions using `e12e.setup()`:

```js
e12e.setup({
  environments : ['dev', 'ci', 'stg', 'prod'],
  defaultEnv : 'dev'
});

e12e.dev('foo'); // 'foo'
e12e.ci('foo', 'bar'); // 'bar'

// Original environment methods are removed
e12e.development('foo'); // throws error
```


Testing
--------

Environmentize's tests are written in [mocha][] and can be run with:

    npm test


Contributing
------------

Feel free to submit any patches or report any issues. I'll do my best to 
check them as quick as possible (in a few days, usually). When submitting a
patch, please add your name and link to the author section below.

I would greatly appreciate if someone could double check the tests. I'm
sure there's plenty of room for improvements there.

Issues and patches regarding grammar errors in code comments and docs are
welcome as well. : )


Author
------

Created by [Mathias Kretschek][mathias] ([mkretschek][]).


[mathias]: http://mathias.ms
[mkretschek]: https://github.com/mkretschek
[mocha]: https://github.com/visionmedia/mocha

