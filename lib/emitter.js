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

Emitter.prototype._emit = function(func, args) {
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

/*
	tag - string
	attributes - object
 */
Emitter.prototype.elementOpenStart = function(tag) {
	this._emit('elementOpenStart', ['\'' + tag + '\'']);
};

Emitter.prototype.elementOpenEnd = function() {
	this._emit('elementOpenEnd');
	this.depth++;
};

Emitter.prototype.elementClose = function(tag) {
	this.depth--;
	this._emit('elementClose', ['\'' + tag + '\'']);
};

Emitter.prototype.text = function(text) {
	this._emit('text', [text]);
};

Emitter.prototype.outputString = function() {
	return this.buf;
};

module.exports = Emitter;