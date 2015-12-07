var compiler = require('./lib/compiler');
var fs = require('fs');

var tpl = fs.readFileSync(__dirname + '/example.hbs', 'utf8');

var result = compiler.compile(tpl);

console.log('function template(data) {');
console.log(result);
console.log('}');
