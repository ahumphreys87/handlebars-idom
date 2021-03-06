'use strict';

var _ = require('lodash');
var indent = require('./utils').indent;
var slashes = require('slashes');

function Emitter() {
  this.depth = -1;
  this.buf = '';
}

Emitter.prototype._emitFunc = function(func, args) {
  args = args || [];

  this.buf += indent(this.depth);
  this.buf += 'var el = IncrementalDOM.' + func;
  this.buf += '(' + args.join(', ') + ');\n';
};

Emitter.prototype.element = function(tag, attributes, iteree, cb) {

  var args = [
    '\'' + tag + '\'',
    'null',
    'null',
  ];

  iteree = iteree || 'data';

  _.each(attributes, function(attribute) {
    args.push('\'' + attribute.name + '\'');
    if (attribute.value.parts) {
      var attrString = '\'\'';

      _.each(attribute.value.parts, function(part) {
        if (part.type === 'StringLiteral') {
          attrString += ' + \'' + slashes.add(part.original) + '\'';
        } else {
          attrString += ' + (' + iteree + '.' + slashes.add(part.original) + ' || \'\')';
        }
      });

      args.push(attrString);
    } else {
      args.push('\'' + slashes.add(attribute.value.chars) + '\'');
    }
  });

  this._emitFunc('elementOpen', args);

  cb();

  this._emitFunc('elementClose', ['\'' + tag + '\'']);
};

Emitter.prototype.elementVoid = function(tag, attributes, iteree) {

  var args = [
    '\'' + tag + '\'',
    'null',
    'null',
  ];

  iteree = iteree || 'data';

  _.each(attributes, function(attribute) {
    args.push('\'' + attribute.name + '\'');
    if (attribute.value.parts) {
      var attrString = '\'\'';

      _.each(attribute.value.parts, function(part) {
        if (part.type === 'StringLiteral') {
          attrString += ' + \'' + slashes.add(part.original) + '\'';
        } else {
          attrString += ' + (' + iteree + '.' + slashes.add(part.original) + ' || \'\')';
        }
      });

      args.push(attrString);
    } else {
      args.push('\'' + slashes.add(attribute.value.chars) + '\'');
    }
  });

  this._emitFunc('elementVoid', args);
};

Emitter.prototype.placeholder = function(tag, attributes) {
  var _this = this;

  _.remove(attributes, function(attribute) {
    return attribute.name === 'skip';
  });

  _this._emitFunc('skip');
  this.elementVoid(tag, attributes);
};

Emitter.prototype.else = function() {
  this.buf += '} else {\n';
};

Emitter.prototype.if = function(params, iteree, cb) {
  var _this = this;
  iteree = iteree || 'data';

  this.buf += 'if (';

  _.each(params, function(param) {
    _.each(param.parts, function(part) {
      _this.buf += iteree + '.' + part;
    });

    _this.buf +=  ') {\n';
  });

  cb();

  this.buf += '}\n';
};

Emitter.prototype.unless = function(params, iteree, cb) {
  var _this = this;
  iteree = iteree || 'data';

  this.buf += 'if (!';

  _.each(params, function(param) {
    _.each(param.parts, function(part) {
      _this.buf += iteree + '.' + part;
    });

    _this.buf +=  ') {\n';
  });

  cb();

  this.buf += '}\n';
};

Emitter.prototype.with = function(params, cb) {
  var iteree = params[0].parts[0];
  cb('data.' + iteree);
};

Emitter.prototype.each = function(params, depth, currentIteree, cb) {
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
