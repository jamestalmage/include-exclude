include-exclude
===============
A wrapper around minimatch. Provides end-user friendly `include` and `exclude` pattern arrays.
Targeted at tool / library developers.

usage
-----
```javascript
var includeExclude = require('include-exclude');

function filteredUtilityFunction(opts){
  filter = includeExclude(opts);

  return function(somePath){
    if(!filter(somePath)) return;
    // do stuff!
  }
}

var utilityFunc = filteredUtilityFunc({include:'**/test/*.js'});

utilityFunc('someDir/src/index.js');  // nothing happens
utilityFunc('someDir/test/index.js'); // only stuff in the "test" directory gets past the filter.
```

options
-------
The options object itself is optional. If you don't provide an options object, or if your
options object does not have either an `include` and/or `exclude` property, the returned `filter`
will always return true. This behavior is intended to reduce the need for argument checking (tries
to provide a sensible default so you don't have to).

**options.include**

  Pattern or array of patterns for inclusion.

  Defaults to matching everything (i.e. everything is included).

**options.exclude**

  Pattern or array of patterns for exclusion.

  defaults to matching nothing (i.e. nothing is excluded).

**options.base**

  glob patterns matched relative to this `base` (defaults to process.cwd())


matching rules
--------------

  * You can use a `!` as the first character of any pattern to negate it

     `exclude:['tests/**','!tests/utils.js']` excludes everything in the tests directory except `utils.js`

  * Patterns can be a string, array of strings, null or undefined.
  * `base` option is computed relative to `process.cwd()`. `base:'..'` would match from the parent directory.
  Use a leading `/` for absolute urls.
  * Exclude takes precedent over include.


install
-------

```
npm install include-exclude
```