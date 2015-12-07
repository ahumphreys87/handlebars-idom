var HTMLBars = require('../node_modules/htmlbars/dist/cjs/htmlbars-syntax.js');
var Emitter = require('./emitter');

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

function walkProgram(program, emitter) {
  // console.log(program);
  for (var i = 0; i < program.body.length; i++) {
    walkTree(program.body[i], emitter);
  }
}

function walkBlockStatement(blockStatement, emitter) {
  walkTree(blockStatement.path, emitter);
  walkTree(blockStatement.program, emitter);
}

function walkMustacheStatement(mustacheStatement, emitter) {
  walkTree(mustacheStatement.path, emitter);
  for (var i = 0; i < mustacheStatement.params.length; i++) {
    walkTree(mustacheStatement.params[i], emitter);
  }
}

function walkConcatStatement(concatStatement, emitter) {
  for (var i = 0; i < concatStatement.parts.length; i++) {
    walkTree(concatStatement.parts[i], emitter);
  }
}

function walkElementNode(elementNode, emitter) {
  // printValue(elementNode.tag, 'tag');
  emitter.element(elementNode.tag, function(ctx) {
    for (var i = 0; i < elementNode.attributes.length; i++) {
      walkTree(elementNode.attributes[i], emitter);
      //ctx.attr()
    }

    for (var i2 = 0; i2 < elementNode.children.length; i2++) {
      walkTree(elementNode.children[i2], emitter);
    }
  });
}

function walkTextNode(textNode, emitter) {
  // printValue(textNode.chars, 'chars');
  emitter.text('\'' + textNode.chars + '\'');
}

function walkAttrNode(attrNode, emitter) {
  // printValue(attrNode.name, 'name');
  walkTree(attrNode.value, emitter);
}

function walkPathExpression(pathExpression, emitter) {
  switch(pathExpression.original) {
  case 'if':
    return emitter.if();
  default:
    // treat as variable
    emitter.text('data.' + pathExpression.parts.join('.'));
  }
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

function walkTree(node, emitter) {
  var walkFn = getWalkFn(node.type);

  walkDepth++;
  print(node.type);
  walkFn(node, emitter);
  walkDepth--;
}

module.exports.compile = function(handlebarsSrc) {
  console.log('===================== source =====================');
  console.log(handlebarsSrc);

	var ast = HTMLBars.parse(handlebarsSrc);
	console.log('======================= ast ======================');
  console.log(ast);
  console.log('================= simplified ast =================');

  var rootEmitter = new Emitter();
	walkTree(ast, rootEmitter);
  return rootEmitter.outputString();
};