var IncrementalDOM = require('incremental-dom')
require('./common');

var compiler = require('../../lib/compiler');

global.CompilerContext = {
  browser: true,

  compile: function(template, options) {
    var templateSpec = compiler.compile(template, options);
    return templateSpec;
  },
  compileWithPartial: function(template, options) {
    return compiler.compile(template, options);
  }
};
