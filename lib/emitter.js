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
	this.buf += func + '(';
	for (var i = 0; i < args.length; i++) {
		this.buf += args[i];
		if (i < args.length-1) {
			this.buf += ', ';
		}
	};
	this.buf += ');\n'
};

Emitter.prototype.element = function(tag, cb) {
	this._emitFunc('elementOpen', ['\'' + tag + '\'']);
	
	cb({
		attr: function() {
			
		}
	});

	this._emitFunc('elementClose', ['\'' + tag + '\'']);
};

Emitter.prototype.elementOpenStart = function(tag) {
};

Emitter.prototype.elementOpenEnd = function() {
	this._emitFunc('elementOpenEnd');
	this.depth++;
};

Emitter.prototype.elementClose = function(tag) {
	
	
};

Emitter.prototype.text = function(text) {
	this._emitFunc('text', [text]);
};

Emitter.prototype.outputString = function() {
	return this.buf;
};

module.exports = Emitter;