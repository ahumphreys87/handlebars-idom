var exec = require('child_process').exec;
var fs = require('fs');

var cliPath = __dirname + '/../cli.js';
var execOpts = { shell: '/bin/bash' };

describe('cli', function() {
  
  it('using pipes', function(done) {
    exec('echo -n "{{data}}" | ' + cliPath, execOpts, function(err, stdout, stderr) {
      equal(err, null);
      equal(stdout, 'IncrementalDOM.text(data.data);\n');
      equal(stderr, '');
      done();
    });
  });

  it('using input file', function(done) {
    exec(cliPath + ' --input spec/fixtures/basic.hbs', execOpts, function(err, stdout, stderr) {
      equal(err, null);
      equal(stdout, 'IncrementalDOM.text(\'Goodbye\\n\');\nIncrementalDOM.text(data.cruel);\n' + 
        'IncrementalDOM.text(\'\\n\');\nIncrementalDOM.text(data.world);\nIncrementalDOM.text(\'!\\n\');\n');
      equal(stderr, '');
      done();
    });
  });

  it('using output file', function(done) {
    exec(cliPath + ' --input spec/fixtures/basic.hbs --output cli.testoutput', execOpts, function(err, stdout, stderr) {
      equal(err, null);
      equal(stdout, '');
      equal(stderr, '');
      var outputFile = fs.readFileSync('cli.testoutput', 'utf8');
      equal(outputFile, 'IncrementalDOM.text(\'Goodbye\\n\');\nIncrementalDOM.text(data.cruel);\n' + 
        'IncrementalDOM.text(\'\\n\');\nIncrementalDOM.text(data.world);\nIncrementalDOM.text(\'!\\n\');\n');
      done();
    });
  });

  it('exit with status 1 for missing input file', function(done) {
    exec(cliPath + ' --input missingfile.hbs', execOpts, function(err, stdout, stderr) {
      equal(err.code, 1);
      equal(stdout, '');
      equal(true, /no such file or directory/.test(stderr));
      done();
    });
  });

  it('exit with status 1 for invalid hbs syntax', function(done) {
    exec('echo -n "{{#if}}" | ' + cliPath, execOpts, function(err, stdout, stderr) {
      equal(err.code, 1);
      equal(stdout, '');
      equal(true, /error compiling: Parse error on line 1/.test(stderr));
      done();
    });
  });

});