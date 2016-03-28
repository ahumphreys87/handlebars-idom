describe('basic context', function() {
  it('most basic', function() {
    shouldCompileTo('{{foo}}', { foo: 'foo' }, 'IncrementalDOM.text(data.foo);\n');
  });

  it('compiling with a basic context', function() {
    shouldCompileTo('Goodbye\n{{cruel}}\n{{world}}!', {cruel: 'cruel', world: 'world'}, 'IncrementalDOM.text(\'Goodbye\n\');\nIncrementalDOM.text(data.cruel);\nIncrementalDOM.text(data.world);\nIncrementalDOM.text(\'!\');\n',
                    'It works if all the required keys are provided');
  });

  it.skip('compiling with a string context', function() {
    shouldCompileTo('{{.}}{{length}}', 'bye', 'IncrementalDOM.text(data);\nIncrementalDOM.text(data.length);\n');
  });

  it('comments', function() {
    shouldCompileTo('{{! Goodbye}}Goodbye\n{{cruel}}\n{{world}}!',
      {cruel: 'cruel', world: 'world'}, 'IncrementalDOM.text(\'Goodbye\n\');\nIncrementalDOM.text(data.cruel);\nIncrementalDOM.text(data.world);\nIncrementalDOM.text(\'!\');\n',
      'comments are ignored');

    shouldCompileTo('    {{~! comment ~}}      blah', {}, 'IncrementalDOM.text(\'blah\');\n');
    shouldCompileTo('    {{~!-- long-comment --~}}      blah', {}, 'IncrementalDOM.text(\'blah\');\n');
    shouldCompileTo('    {{! comment ~}}      blah', {}, 'IncrementalDOM.text(\'blah\');\n');
    shouldCompileTo('    {{!-- long-comment --~}}      blah', {}, 'IncrementalDOM.text(\'blah\');\n');
    shouldCompileTo('    {{~! comment}}      blah', {}, 'IncrementalDOM.text(\'      blah\');\n');
    shouldCompileTo('    {{~!-- long-comment --}}      blah', {}, 'IncrementalDOM.text(\'      blah\');\n');
  });

  it('zeros', function() {
    shouldCompileTo('num1: {{num1}}, num2: {{num2}}', {num1: 42, num2: 0},
        'IncrementalDOM.text(\'num1: \');\nIncrementalDOM.text(data.num1);\nIncrementalDOM.text(\', num2: \');\nIncrementalDOM.text(data.num2);\n');
    // shouldCompileTo('num: {{.}}', 0, 'IncrementalDOM.text(\'num: \');\nIncrementalDOM.text(data);\n');
    shouldCompileTo('num: {{num1/num2}}', {num1: {num2: 0}}, 'IncrementalDOM.text(\'num: \');\nIncrementalDOM.text(data.num1.num2);\n');
  });

  it('false', function() {
    shouldCompileTo('val1: {{val1}}, val2: {{val2}}', {val1: false, val2: new Boolean(false)}, 'IncrementalDOM.text(\'val1: \');\nIncrementalDOM.text(data.val1);\nIncrementalDOM.text(\', val2: \');\nIncrementalDOM.text(data.val2);\n');
    // shouldCompileTo('val: {{.}}', false, 'IncrementalDOM.text(\'val: \');\nIncrementalDOM.text(data);\n');
    shouldCompileTo('val: {{val1/val2}}', {val1: {val2: false}}, 'IncrementalDOM.text(\'val: \');\nIncrementalDOM.text(data.val1.val2);\n');
    shouldCompileTo('val1: {{{val1}}}, val2: {{{val2}}}', {val1: false, val2: new Boolean(false)}, 'IncrementalDOM.text(\'val1: \');\nIncrementalDOM.text(data.val1);\nIncrementalDOM.text(\', val2: \');\nIncrementalDOM.text(data.val2);\n');
    shouldCompileTo('val: {{{val1/val2}}}', {val1: {val2: false}}, 'IncrementalDOM.text(\'val: \');\nIncrementalDOM.text(data.val1.val2);\n');
  });

  it.skip('newlines', function() {
    shouldCompileTo("Alan's\nTest", {}, "IncrementalDOM.text('Alan\'s\\nTest');\n");
    shouldCompileTo("Alan's\rTest", {}, "IncrementalDOM.text('Alan\'s\\rTest');\n");
  });

  it.skip('escaping text', function() {
    shouldCompileTo("Awesome's", {}, "Awesome's", "text is escaped so that it doesn't get caught on single quotes");
    shouldCompileTo('Awesome\\', {}, 'Awesome\\', "text is escaped so that the closing quote can't be ignored");
    shouldCompileTo('Awesome\\\\ foo', {}, 'Awesome\\\\ foo', "text is escaped so that it doesn't mess up backslashes");
    shouldCompileTo('Awesome {{foo}}', {foo: '\\'}, 'Awesome \\', "text is escaped so that it doesn't mess up backslashes");
    shouldCompileTo(" ' ' ", {}, " ' ' ", 'double quotes never produce invalid javascript');
  });

  it.skip('paths with hyphens', function() {
    shouldCompileTo('{{foo-bar}}', {'foo-bar': 'baz'}, 'IncrementalDOM.text(data[\'foo-bar\']);\n', 'Paths can contain hyphens (-)');
    shouldCompileTo('{{foo.foo-bar}}', {foo: {'foo-bar': 'baz'}}, 'IncrementalDOM.text(data[\'foo\'][\'foo-bar\']);\n', 'Paths can contain hyphens (-)');
    shouldCompileTo('{{foo/foo-bar}}', {foo: {'foo-bar': 'baz'}}, 'IncrementalDOM.text(data[\'foo\'][\'foo-bar\']);\n', 'Paths can contain hyphens (-)');
  });

  it('nested paths', function() {
    shouldCompileTo('Goodbye {{alan/expression}} world!', {alan: {expression: 'beautiful'}},
                    'IncrementalDOM.text(\'Goodbye \');\nIncrementalDOM.text(data.alan.expression);\nIncrementalDOM.text(\' world!\');\n', 'Nested paths access nested objects');
  });

  it('nested paths with empty string value', function() {
    shouldCompileTo('Goodbye {{alan/expression}} world!', {alan: {expression: ''}},
                    'IncrementalDOM.text(\'Goodbye \');\nIncrementalDOM.text(data.alan.expression);\nIncrementalDOM.text(\' world!\');\n', 'Nested paths access nested objects with empty string');
  });

  it.skip('literal paths', function() {
    shouldCompileTo('Goodbye {{[@alan]/expression}} world!', {'@alan': {expression: 'beautiful'}},
        'IncrementalDOM.text(\'Goodbye \');\nIncrementalDOM.text(data[\'alan\'][\'expression\']);\nIncrementalDOM.text(\' world!\');\n', 'Literal paths can be used');
    shouldCompileTo('Goodbye {{[foo bar]/expression}} world!', {'foo bar': {expression: 'beautiful'}},
        'IncrementalDOM.text(\'Goodbye \');\nIncrementalDOM.text(data.alan.expression);\nIncrementalDOM.text(\' world!\');\n', 'Literal paths can be used');
  });

  it.skip('literal references', function() {
    shouldCompileTo('Goodbye {{[foo bar]}} world!', {'foo bar': 'beautiful'}, 'Goodbye beautiful world!');
    shouldCompileTo('Goodbye {{"foo bar"}} world!', {'foo bar': 'beautiful'}, 'Goodbye beautiful world!');
    shouldCompileTo("Goodbye {{'foo bar'}} world!", {'foo bar': 'beautiful'}, 'Goodbye beautiful world!');
    shouldCompileTo('Goodbye {{"foo[bar"}} world!', {'foo[bar': 'beautiful'}, 'Goodbye beautiful world!');
    shouldCompileTo('Goodbye {{"foo\'bar"}} world!', {"foo'bar": 'beautiful'}, 'Goodbye beautiful world!');
    shouldCompileTo("Goodbye {{'foo\"bar'}} world!", {'foo"bar': 'beautiful'}, 'Goodbye beautiful world!');
  });

  it('complex but empty paths', function() {
    shouldCompileTo('{{person/name}}', {person: {name: null}}, 'IncrementalDOM.text(data.person.name);\n');
    shouldCompileTo('{{person/name}}', {person: {}}, 'IncrementalDOM.text(data.person.name);\n');
  });  

  it.skip('pass string literals', function() {
    shouldCompileTo('{{"foo"}}', {}, '');
    shouldCompileTo('{{"foo"}}', { foo: 'bar' }, 'bar');
  });

  it.skip('pass number literals', function() {
    shouldCompileTo('{{12}}', {}, '');
    shouldCompileTo('{{12}}', { '12': 'bar' }, 'bar');
    shouldCompileTo('{{12.34}}', {}, '');
    shouldCompileTo('{{12.34}}', { '12.34': 'bar' }, 'bar');
    shouldCompileTo('{{12.34 1}}', { '12.34': function(arg) { return 'bar' + arg; } }, 'bar1');
  });

  it('pass boolean literals', function() {
    shouldCompileTo('{{true}}', {}, 'IncrementalDOM.text(data[\'true\'])');
    shouldCompileTo('{{true}}', { '': 'foo' }, 'IncrementalDOM.text(data[\'true\'])');
    shouldCompileTo('{{false}}', { 'false': 'foo' }, 'IncrementalDOM.text(data[\'false\'])');
  });
});
