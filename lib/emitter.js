'use strict';

var _ = require('lodash');
var indent = require('./utils').indent;

function Emitter() {
  this.depth = -1;
  this.buf = '';
}

Emitter.prototype._emitFunc = function(func, args) {
  args = args || [];

  this.buf += indent(this.depth);
  this.buf += 'IncrementalDOM.' + func;
  this.buf += '(' + args.join(', ') + ');\n';
};

Emitter.prototype.element = function(tag, attributes, cb) {
  var args = [
    '\'' + tag + '\'',
    'null',
    'null',
  ];

  _.each(attributes, function(attribute) {
    args.push('\'' + attribute.name + '\'');

    if (attribute.value.parts) {
      args.push('data.' + attribute.value.parts[0].original);
    } else {
      args.push('\'' + attribute.value.chars + '\'');
    }
  });

  this._emitFunc('elementOpen', args);

  cb({
    attr: function() {

    },
  });

  this._emitFunc('elementClose', ['\'' + tag + '\'']);
};

Emitter.prototype.placeholder = function(tag, key, attributes) {
  var args = [
    '\'' + tag + '\'',
    '\'' + key + '\'',
    'null',
  ];

  _.each(attributes, function(attribute) {
    args.push('\'' + attribute.name + '\'');
    args.push('\'' + attribute.value.chars + '\'');
  });

  this._emitFunc('elementPlaceholder', args);
};

Emitter.prototype.elementOpenStart = function() {
};

Emitter.prototype.elementOpenEnd = function() {
  this._emitFunc('elementOpenEnd');
  this.depth++;
};

Emitter.prototype.elementClose = function() {
};

Emitter.prototype.else = function() {
  this.buf += '} else {';
};

Emitter.prototype.if = function(params, cb) {
  this.buf += 'if (';

  _.each(params, function(param) {
    _.each(param.parts, function(part) {
      this.buf += 'data.' + part;
    }, this);
    this.buf +=  ') {\n';
  }, this);

  cb();

  this.buf += '}\n';
};

Emitter.prototype.with = function(params, cb) {
  var iteree = params[0].parts[0];
  cb('data.' + iteree);
};

Emitter.prototype.each = function(params, depth, currentIteree ,cb) {
  var iteree = (currentIteree ? currentIteree + '.' : 'data.') + params[0].parts[0];
  var i = 'i' + depth;

  this.buf += 'for (var ' + i + ' in ' + iteree + ') {\n';
  cb(iteree + '[' + i + ']');

  this.buf += '}\n';
};

Emitter.prototype.text = function(text, showSpace) {
  if (/\S/.test(text.replace(/\'/g, '')) || showSpace) {
    this._emitFunc('text', [text]);
  }
};

Emitter.prototype.stringLiteral = function(value) {
  this._emitFunc('text', ['data[\'' + value + '\']']);
};

Emitter.prototype.booleanLiteral = function(value) {
  this._emitFunc('text', ['data[\'' + value + '\']']);
};

Emitter.prototype.numberLiteral = function(value) {
  this._emitFunc('text', ['data[\'' + value + '\']']);
};

Emitter.prototype.outputString = function() {
  return this.buf;
};

module.exports = Emitter;
