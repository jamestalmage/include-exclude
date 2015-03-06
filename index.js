module.exports = createFilter;

var multimatch = require('multimatch');
var path = require('path');

function always(){
  return true;
}

function createFilter(opts){
  var includePattern = opts && opts.include
    , excludePattern = opts && opts.exclude
    , base = path.resolve(opts && opts.base || '.');

  if(!(includePattern || excludePattern)) return always;

  var included = includePattern ? function (path) {
    return !!multimatch(path, includePattern).length;
  } : always;

  var notExcluded = excludePattern ? function (path) {
    return !multimatch(path, excludePattern).length;
  } : always;

  function test(file) {
    var p = path.relative(base, file);
    return notExcluded(p) && included(p);
  }

  return test;
}