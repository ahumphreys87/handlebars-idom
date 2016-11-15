# handlebars-idom

A handlebars to incrememtal-dom compiler designed to compile handlebars templates into the appropriate JavaScript for Incremental DOM. Particularly useful when used along with `hbsidomify` to pre-compile Handlebars templates into Javascript functions for use in Single Page Applications on a variety of JavaScript MVC frameworks.

*NOTE: This project is currently a WIP, while compiles basic handlebars statements and most builtin helpers you should take extra care running this in your projects as you may experience some incompatibilities. The tests ran in the `spec` folder can provide details of what is currently covered and what is yet to be implemented.*

## Installation

```
npm install handlebars-idom --save
```

## Package Usage

```js
var HbsIdom = require('handlebars-idom');
var fs = require('fs');
var hbs = fs.readFileSync('./example.hbs', 'utf8');

var idom = HbsIdom.compile(hbs);
```

## CLI


```bash
# piped i/o
echo -n "{{hello}}" | hbsidom > hello.out

# file paths
hbsidom --input hello.hbs --output hello.out
```