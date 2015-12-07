var HTMLBars = require('../node_modules/htmlbars/dist/cjs/htmlbars-syntax.js');
var emitter = require('./emitter');
emitter = new emitter();

var walkDepth = -1;

function indent() {
  var strbuf = [];
  for (var i = 0; i < walkDepth; i++) {
    strbuf.push('  ');
  }
  return strbuf.join('');
}

function print(str) {
  console.log(indent() + str);
}

function printValue(str, key) {
  console.log(indent() + '|' + (key ? key + ':' : '') + str);
}

function walkProgram(program) {
  // console.log(program);
  for (var i = 0; i < program.body.length; i++) {
    walkTree(program.body[i]);
  }
}

function walkBlockStatement(blockStatement) {
  walkTree(blockStatement.path);
  walkTree(blockStatement.program);
}

function walkMustacheStatement(mustacheStatement) {
  walkTree(mustacheStatement.path);
  for (var i = 0; i < mustacheStatement.params.length; i++) {
    walkTree(mustacheStatement.params[i]);
  }
}

function walkConcatStatement(concatStatement) {
  for (var i = 0; i < concatStatement.parts.length; i++) {
    walkTree(concatStatement.parts[i]);
  }
}

function walkElementNode(elementNode) {
  // printValue(elementNode.tag, 'tag');
  emitter.elementOpenStart(elementNode.tag);

  for (var i = 0; i < elementNode.attributes.length; i++) {
    walkTree(elementNode.attributes[i]);
  }

  emitter.elementOpenEnd();
  for (var i2 = 0; i2 < elementNode.children.length; i2++) {
    walkTree(elementNode.children[i2]);
  }


  emitter.elementClose(elementNode.tag);
}

function walkTextNode(textNode) {
  // printValue(textNode.chars, 'chars');
  emitter.text('\'' + textNode.chars + '\'');
}

function walkAttrNode(attrNode) {
  // printValue(attrNode.name, 'name');
  walkTree(attrNode.value);
}

function walkPathExpression(pathExpression) {
  emitter.text('data.' + pathExpression.parts.join('.'));
  // printValue(pathExpression.parts.join('.'), 'path');
}

function walkStringLiteral(stringLiteral) {
  // printValue(stringLiteral.value, 'value');
}

function getWalkFn(nodeType) {
  switch (nodeType) {
    case 'Program':
      return walkProgram;
    case 'BlockStatement':
      return walkBlockStatement;
    case 'MustacheStatement':
      return walkMustacheStatement;
    case 'ConcatStatement':
      return walkConcatStatement;
    case 'ElementNode':
      return walkElementNode;
    case 'TextNode':
      return walkTextNode;
    case 'AttrNode':
      return walkAttrNode;
    case 'PathExpression':
      return walkPathExpression;
    case 'StringLiteral':
      return walkStringLiteral;
    default:
      throw new Error('Unexpected Node type: ' + nodeType);
  }
}

function walkTree(node) {
  var walkFn = getWalkFn(node.type);

  walkDepth++;
  print(node.type);
  walkFn(node);
  walkDepth--;
}

module.exports.compile = function(handlebarsSrc) {
  console.log('src:\n', handlebarsSrc);

	var ast = HTMLBars.parse(handlebarsSrc);
	console.log('ast:');
  console.log(ast);
  console.log('simplified:');


	walkTree(ast);
  return emitter.outputString();
};