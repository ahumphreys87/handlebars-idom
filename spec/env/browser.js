require('./common');

var fs = require('fs'),
    vm = require('vm');

var compiler = require('../../lib/compiler');

global.CompilerContext = {
  browser: true,

  compile: function(template, options) {
    var templateSpec = compiler.compile(template, options);
    return templateSpec;
    // TODO: add method to wrap in a template fn
    // return handlebarsEnv.template(safeEval(templateSpec));
  },
  compileWithPartial: function(template, options) {
    return compiler.compile(template, options);
  }
};

// function safeEval(templateSpec) {
//   /* eslint-disable no-eval, no-console */
//   try {
//     return eval('(' + templateSpec + ')');
//   } catch (err) {
//     console.error(templateSpec);
//     throw err;
//   }
//   /* eslint-enable no-eval, no-console */
// }
