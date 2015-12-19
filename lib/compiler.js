var HTMLBars = require('../node_modules/htmlbars/dist/cjs/htmlbars-syntax.js');
var Emitter = require('./emitter');
var _ = require('lodash');

var walkDepth = -1;
var level = 0;

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

function walkProgram(program, emitter, iteree) {
  // console.log(program);
  for (var i = 0; i < program.body.length; i++) {
    walkTree(program.body[i], emitter, iteree);
  }
}

function walkBlockStatement(blockStatement, emitter, iteree) {
  if (blockStatement.params.length) {
    // check block type
    var type = blockStatement.path.parts[0];

    switch (type) {
      case 'if':
        emitter.if(blockStatement.params, function() {
          walkTree(blockStatement.program, emitter, iteree);
          console.log('in an if', blockStatement.inverse);
          if (blockStatement.inverse) {
            emitter.else();
            walkTree(blockStatement.inverse, emitter, iteree);
          }
        });
        break;
      case 'each':
        emitter.each(blockStatement.params, level, function(iteree) {
          console.log('in an each', iteree);
          level++;
          walkTree(blockStatement.program, emitter, iteree);
        });
        level = 0;
        break;
      case 'with':
        emitter.with(blockStatement.params, function(iteree) {
          console.log('in a with', iteree);
          walkTree(blockStatement.program, emitter, iteree);
        });
        break;
      default:
        throw new Error('Unknown block type:' + type);
    }

    
    // walkTree(blockStatement.path, emitter, true, iteree);
    // walkTree(blockStatement.params, emitter, true, iteree);
  } else {
    walkTree(blockStatement.path, emitter, iteree);
    walkTree(blockStatement.program, emitter, iteree);
  }
}

function walkMustacheStatement(mustacheStatement, emitter, iteree) {
  walkTree(mustacheStatement.path, emitter, iteree, iteree);
  for (var i = 0; i < mustacheStatement.params.length; i++) {
    walkTree(mustacheStatement.params[i], emitter, iteree);
  }
}

function walkConcatStatement(concatStatement, emitter, iteree) {
  for (var i = 0; i < concatStatement.parts.length; i++) {
    walkTree(concatStatement.parts[i], emitter, iteree);
  }
}

function walkElementNode(elementNode, emitter, iteree) {
  // printValue(elementNode.tag, 'tag');
  emitter.element(elementNode.tag, elementNode.attributes, function(ctx) {
    for (var i2 = 0; i2 < elementNode.children.length; i2++) {
      // console.log("child", elementNode.children[i2]);
      walkTree(elementNode.children[i2], emitter, iteree);
    }
  });
}

function walkTextNode(textNode, emitter, iteree) {
  // printValue(textNode.chars, 'chars');
  emitter.text('\'' + textNode.chars + '\'');
}

function walkAttrNode(attrNode, emitter, iteree) {
  // printValue(attrNode.name, 'name');
  console.log('attr', attrNode);
  emitter.attribute(attrNode);
  // walkTree(attrNode.value, emitter, iteree);
}

function walkPathExpression(pathExpression, emitter, iteree) {
  console.log('path exp', pathExpression, iteree);
  switch(pathExpression.original) {
  case 'this':
    emitter.text(iteree + '[i' + (level - 1) + ']');
    break;
  case '@index':
    emitter.text('counter' + (level - 1));
    break;
  case '@key':
    emitter.text('i' + (level - 1));
    break;
  default:
    console.log('data.' + pathExpression.parts.join('.'));
    // treat as variable
    if (iteree) {
      // split the original
      var pathParts = pathExpression.original.split('/');
      var itereeParts = iteree.split('.');
      var levelDepth = pathParts.length - 1;
      var itereeIndex = itereeParts.length - levelDepth;
      var itereeParts = _.slice(itereeParts, 0, itereeIndex + 1);

      emitter.text(itereeParts.join('.') + '.' + pathExpression.parts.join('.'));
    } else {
      emitter.text('data.' + pathExpression.parts.join('.'));
    }
  }
}

function walkStringLiteral(stringLiteral, iteree) {
  // printValue(stringLiteral.value, 'value');
}

function getWalkFn(nodeType) {
  console.log(nodeType);

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

function walkTree(node, emitter, iteree) {
  var isCondition = false;
  if (_.isArray(node)) {
    node = node[0];
  }

  var walkFn = getWalkFn(node.type);

  walkDepth++;
  print(node.type);
  walkFn(node, emitter, iteree);
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