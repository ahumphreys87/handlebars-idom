var _ = require('lodash');

function Emitter() {
  this.depth = -1;
  this.buf = '';
}

function indent(depth) {
  var strbuf = [];
  for (var i = 0; i <= depth; i++) {
    strbuf.push('  ');
  }
  return strbuf.join('');
}

Emitter.prototype._emitFunc = function(func, args) {
  args = args || [];

  this.buf += indent(this.depth);
  this.buf += 'IncrementalDOM.' + func + '(';

  for (var i = 0; i < args.length; i++) {
    this.buf += args[i];
    if (i < args.length-1) {
      this.buf += ', ';
    }
  };
  this.buf += ');\n'
};

Emitter.prototype.element = function(tag, attributes, cb) {
  var args = [
    '\'' + tag + '\'',
    'null',
    'null'
  ];

  _.each(attributes, function(attribute) {
    args.push('\'' + attribute.name + '\'');
    args.push('\'' + attribute.value.chars + '\'');
  });

  this._emitFunc('elementOpen', args);
  
  cb({
    attr: function() {
      
    }
  });

  this._emitFunc('elementClose', ['\'' + tag + '\'']);
};

Emitter.prototype.placeholder = function(tag, key, attributes, cb) {
  var args = [
    '\'' + tag + '\'',
    '\'' + key + '\'',
    'null'
  ];

  _.each(attributes, function(attribute) {
    args.push('\'' + attribute.name + '\'');
    args.push('\'' + attribute.value.chars + '\'');
  });

  this._emitFunc('elementPlaceholder', args);
};

Emitter.prototype.elementOpenStart = function(tag) {
};

Emitter.prototype.elementOpenEnd = function() {
  this._emitFunc('elementOpenEnd');
  this.depth++;
};

Emitter.prototype.elementClose = function(tag) {
  
  
};

Emitter.prototype.else = function(params, cb) {
  this.buf += '} else {';
};

Emitter.prototype.if = function(params, cb) {
  this.buf += 'if (';

  _.each(params, function(param) {
    _.each(param.parts, function(part) {
      this.buf += 'data.' + part;
    }, this);
    this.buf +=  ') {';
  }, this);

  cb();

  this.buf += '}';
};

Emitter.prototype.with = function(params, cb) {
  var iteree = params[0].parts[0];
  cb('data.' + iteree);
};

Emitter.prototype.each = function(params, cb) {
  var iteree = params[0].parts[0];

  this.buf += 'var counter = 0; for (var i in data.' + iteree + ') {';
  cb('data.' + iteree);

  this.buf += 'counter++;}';
};

Emitter.prototype.text = function(text) {
  if (/\S/.test(text.replace(/\'/g, ''))) {
    this._emitFunc('text', [text]);
  }
};

Emitter.prototype.outputString = function() {
  return this.buf;
};

module.exports = Emitter;