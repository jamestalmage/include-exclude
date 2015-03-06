'use strict';
describe('filter-transform', function(){

  var sinon = require('sinon');
  var match = sinon.match;
  var chai = require('chai');
  chai.use(require('sinon-chai'));
  var expect = chai.expect;

  var proxyquire = require('proxyquire');

  var includeExclude;

  var path;

  var test;

  var relative, _relative, resolve, _resolve;

  beforeEach(function () {
    relative = sinon.spy(function() {
      return _relative.apply(this,arguments);
    });
    resolve = sinon.spy(function() {
      return _resolve.apply(this,arguments);
    });

    path = {relative:relative, resolve:resolve};

    _relative = function(from, to){
      if (from === '/absolute' && to.indexOf('/absolute/') === 0){
        return to.substr('/absolute/'.length);
      }
      if (from === '/'){
        return to;
      }
      throw new Error('don\'t know do with this: ' + from + ', ' + to)
    };

    _resolve = function(from){
      switch (from) {
        case '.': return '/absolute';
        case '/': return '/';
        case '../absolute2': return '/absolute2'
      }
    };

    includeExclude = proxyquire('..',{
      'path' : path
    });
  });

  function init(opts){
    test = includeExclude(opts);
    return test;
  }

  function run(tests){
    for(var i = 0; i < arguments.length; i++){
      expect(test('/absolute/' + arguments[i][0]), arguments[i][0]).to.equal(arguments[i][1]);
    }
  }

  it('include only', function() {
    init({include:'modA/*.js'});

    run(
      ['modA/test.js', true],
      ['modA/test.coffee', false],
      ['modB/test.js', false]
    );
  });


  it('exclude only', function() {
    init({exclude:'**/*.coffee'});

    run(
      ['modA/test.js', true],
      ['modA/test.coffee', false],
      ['modB/test.js', true]
    );
  });

  it('exclude via !include', function() {
    init({include:'**/*.!(coffee)'});

    run(
      ['modA/test.js', true],
      ['modA/test.coffee', false],
      ['modB/test.js', true]
    );

  });

  it('both include and exclude', function() {
    init({include:'modA/**', exclude:'**/*.coffee'});

    run(
      ['modA/test.js', true],
      ['modA/test.coffee', false],
      ['modB/test.js', false]
    );
  });
  it('multiple patterns in array', function() {
    init({include:['modA/**', 'modB/**'], exclude:['**/*.coffee','**/*.md']});

    run(
      ['modA/test.js', true],
      ['modA/test.coffee', false],
      ['modA/test.md', false],
      ['modB/test.js', true],
      ['modB/test.coffee', false],
      ['modC/test.js', false],
      ['modC/test.coffee', false]
    );
  });

  it('base can be modified', function() {
    init({include:['modA/**', '**/modB/**'], exclude: ['**/*.md'], base:'/'});

    run(
      ['modA/test.js', false],
      ['modA/test.coffee', false],
      ['modA/test.md', false],
      ['modB/test.js', true],
      ['modB/test.coffee', true],
      ['modC/test.js', false],
      ['modC/test.coffee', false]
    );
  });

  it('no patterns matches everything', function(){
    init();
    run(
      ['modA/test.js', true],
      ['modA/test.coffee', true],
      ['modA/test.md', true],
      ['modB/test.js', true],
      ['modB/test.coffee', true],
      ['modC/test.js', true],
      ['modC/test.coffee', true]
    );
  });
});