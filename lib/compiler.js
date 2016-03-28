'use strict';

var HTMLBars = require('../node_modules/htmlbars/dist/cjs/htmlbars-syntax.js');
var Emitter = require('./emitter');
var _ = require('lodash');
var indent = require('./utils').indent;

var walkDepth = -1;

// function print(str) {
//   console.log(indent() + str);
// }

function printValue(str, key) {
  console.log(indent(walkDepth) + '|' + (key ? key + ':' : '') + str);
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
          if (blockStatement.inverse) {
            emitter.else();
            walkTree(blockStatement.inverse, emitter, iteree);
          }
        });
        break;
      case 'each':
        emitter.each(blockStatement.params, function(iteree) {
          walkTree(blockStatement.program, emitter, iteree);
        });
        break;
      case 'with':
        emitter.with(blockStatement.params, function(iteree) {
          walkTree(blockStatement.program, emitter, iteree);
        });
        break;
      default:
        throw new Error('Unknown block type:' + type);
    }
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
  // check for key attribute
  var keyAttr = _.find(elementNode.attributes, {
    name: 'key',
  });

  if (elementNode.children.length || !keyAttr) {
    emitter.element(elementNode.tag, elementNode.attributes, function() {
      for (var i2 = 0; i2 < elementNode.children.length; i2++) {
        walkTree(elementNode.children[i2], emitter, iteree);
      }
    });
  } else {
    emitter.placeholder(elementNode.tag, keyAttr.value, elementNode.attributes);
  }
}

function walkTextNode(textNode, emitter) {
  emitter.text('\'' + textNode.chars + '\'');
}

function walkAttrNode(attrNode, emitter) {
  emitter.attribute(attrNode);
}

function walkPathExpression(pathExpression, emitter, iteree) {
  switch (pathExpression.original) {
  case 'this':
    emitter.text(iteree + '[i]');
    break;
  case '@index':
    emitter.text('counter');
    break;
  case '@key':
    emitter.text('i');
    break;
  default:

    // treat as variable
    if (iteree) {
      emitter.text(iteree + '.' + pathExpression.parts.join('.'));
    } else {
      emitter.text('data.' + pathExpression.parts.join('.'));
    }
  }
}

function walkStringLiteral(stringLiteral) {
  printValue(stringLiteral.value, 'value');
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

function walkTree(node, emitter, iteree) {
  if (_.isArray(node)) {
    node = node[0];
  }

  var walkFn = getWalkFn(node.type);

  walkDepth++;
  walkFn(node, emitter, iteree);
  walkDepth--;
}

module.exports.compile = function(handlebarsSrc) {
  var ast = HTMLBars.parse(handlebarsSrc);
  var rootEmitter = new Emitter();
  walkTree(ast, rootEmitter);
  return rootEmitter.outputString();
};
