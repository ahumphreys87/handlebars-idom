var fs = require('fs');

var AssertError;
if (Error.captureStackTrace) {
  AssertError = function AssertError(message, caller) {
    Error.prototype.constructor.call(this, message);
    this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, caller || AssertError);
    }
  };

  AssertError.prototype = new Error();
} else {
  AssertError = Error;
}

global.shouldCompileTo = function(source, expectedFile, message) {
  var tpl = fs.readFileSync(__dirname + '/../fixtures/' + source, 'utf8');
  var expected = fs.readFileSync(__dirname + '/../expected/' + expectedFile, 'utf8');
  var result = CompilerContext.compile(tpl);
  if (result !== expected) {
    throw new AssertError("'" + result + "' should === '" + expected + "': " + message, shouldCompileTo);
  }
};

global.equals = global.equal = function equals(a, b, msg) {
  if (a !== b) {
    throw new AssertError("'" + a + "' should === '" + b + "'" + (msg ? ': ' + msg : ''), equals);
  }
};

global.shouldThrow = function(callback, type, msg) {
  var failed;
  try {
    callback();
    failed = true;
  } catch (caught) {
    if (type && !(caught instanceof type)) {
      throw new AssertError('Type failure: ' + caught);
    }
    if (msg && !(msg.test ? msg.test(caught.message) : msg === caught.message)) {
      throw new AssertError('Throw mismatch: Expected ' + caught.message + ' to match ' + msg + '\n\n' + caught.stack, shouldThrow);
    }
  }
  if (failed) {
    throw new AssertError('It failed to throw', shouldThrow);
  }
};
