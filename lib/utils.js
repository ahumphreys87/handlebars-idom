'use strict';

module.exports.indent = function indent(depth) {
  return (depth > 0) ? new Array(depth).join('  ') : '';
};
