#!/usr/bin/env node

var program = require('commander');
var pkg = require('./package.json');
var compiler = require('./lib/compiler');
var Readable = require('stream').Readable;
var fs = require('fs');

// report errors to stdout
process.on('uncaughtException', function(err) {
  console.error(err.message || err);
  process.exit(1);
})

program
  .version(pkg.version)
  .option('-i, --input [path]', 'Input file (defaults to stdin)')
  .option('-o, --output [path]', 'Output file (defaults to stdout)')
  .parse(process.argv);

// defaults
var inputStream = process.stdin;
var outputStream = process.stdout;

// options
if (program.input) {
  inputStream = fs.createReadStream(program.input, 'utf8');
}
if (program.output) {
  outputStream = fs.createWriteStream(program.output, 'utf8');
}

// read from input stream
var buf = '';
inputStream.on('data', function(data) { buf += data; });
inputStream.on('end', function() {
  var result;
  // catch error to return helpful message
  try {
    result = compiler.compile(buf);
  } catch(err) {
    var prefix = 'error compiling: ';

    // point user to input file if present
    if (program.input) { 
      prefix = 'error compiling file '+ program.input + ': ';
    }

    throw new Error(prefix + err.message)
  }

  // push result into readable stream
  var s = new Readable();
  s.push(result);
  s.push(null);

  // pipe to output
  s.pipe(outputStream);
});
