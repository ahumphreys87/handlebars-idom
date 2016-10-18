'use strict';

var HTMLBars = require('../node_modules/htmlbars/dist/cjs/htmlbars-syntax.js');
var Emitter = require('./emitter');
var _ = require('lodash');
var slashes = require('slashes');

var walkDepth = -1;

function walkProgram(program, emitter, iteree) {
  for (var i = 0; i < program.body.length; i++) {
    walkTree(program.body[i], emitter, iteree, program.body[i+1] || null);
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
        emitter.each(blockStatement.params, walkDepth, function(iteree) {
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
        walkTree(elementNode.children[i2], emitter, iteree, elementNode.children[i2+1] || null);
      }
    });
  } else {
    emitter.placeholder(elementNode.tag, keyAttr.value, elementNode.attributes);
  }
}

function walkTextNode(textNode, emitter, iteree, nextNode) {
  var nodeType = nextNode ? nextNode.type : '';
  emitter.text('\'' + slashes.add(textNode.chars) + '\'', nodeType === 'MustacheStatement');
}

function walkAttrNode(attrNode, emitter) {
  emitter.attribute(attrNode);
}

function walkPathExpression(pathExpression, emitter, iteree) {
  function getI(arrayString) {
    var startIndex = arrayString.indexOf('[') + 1;
    var endIndex = arrayString.indexOf(']');
    var i = arrayString.substring(startIndex, endIndex);

    return i;
  }

  switch (pathExpression.original) {
  case 'this':
    emitter.text(iteree);
    break;
  case '@index':
    emitter.text(getI(iteree));
    break;
  case '@key':
    emitter.text(getI(iteree));
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

function walkBooleanLiteral(booleanLiteral, emitter) {
  emitter.booleanLiteral(booleanLiteral.value);
}

function walkNumberLiteral(numberLiteral, emitter) {
  if (emitter.buf === '') {
    emitter.numberLiteral(numberLiteral.value);
  }
}

function walkStringLiteral(stringLiteral, emitter) {
  emitter.stringLiteral(stringLiteral.value);
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
    case 'BooleanLiteral':
      return walkBooleanLiteral;
    case 'NumberLiteral':
      return walkNumberLiteral;
    default:
      throw new Error('Unexpected Node type: ' + nodeType);
  }
}

function walkTree(node, emitter, iteree, nextNode) {
  if (_.isArray(node)) {
    node = node[0];
  }

  var walkFn = getWalkFn(node.type);

  walkDepth++;
  walkFn(node, emitter, iteree, nextNode);
  walkDepth--;
}

module.exports.compile = function(handlebarsSrc) {
  var ast = HTMLBars.parse(handlebarsSrc);
  var rootEmitter = new Emitter();
  walkTree(ast, rootEmitter);
  return rootEmitter.outputString();
};
