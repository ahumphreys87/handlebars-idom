describe('basic context', function() {
  it('compiling with basic context and newlines', function() {
    shouldCompileTo('basic.hbs', 'basic.js');
  });

  it('comments', function() {
    shouldCompileTo('comments.hbs', 'comments.js');
  });

  it('escaping text', function() {
    shouldCompileTo('escaping.hbs', 'escaping.js');
  });

  it('nested paths', function() {
    shouldCompileTo('nestedPaths.hbs', 'nestedPaths.js');
  });

  it('pass string literals', function() {
    shouldCompileTo('literals.hbs', 'literals.js');
  });

  // it.skip('paths with hyphens', function() {
  //   shouldCompileTo('{{foo-bar}}', {'foo-bar': 'baz'}, 'IncrementalDOM.text(data[\'foo-bar\']);\n', 'Paths can contain hyphens (-)');
  //   shouldCompileTo('{{foo.foo-bar}}', {foo: {'foo-bar': 'baz'}}, 'IncrementalDOM.text(data[\'foo\'][\'foo-bar\']);\n', 'Paths can contain hyphens (-)');
  //   shouldCompileTo('{{foo/foo-bar}}', {foo: {'foo-bar': 'baz'}}, 'IncrementalDOM.text(data[\'foo\'][\'foo-bar\']);\n', 'Paths can contain hyphens (-)');
  // });
  //
  // it('pass number literals', function() {
  //   shouldCompileTo('{{12}}', {}, 'IncrementalDOM.text(data[\'12\']);\n');
  //   shouldCompileTo('{{12}}', { '12': 'bar' }, 'IncrementalDOM.text(data[\'12\']);\n');
  //   shouldCompileTo('{{12.34}}', {}, 'IncrementalDOM.text(data[\'12.34\']);\n');
  //   shouldCompileTo('{{12.34}}', { '12.34': 'bar' }, 'IncrementalDOM.text(data[\'12.34\']);\n');
  // });
  //
  // it('pass boolean literals', function() {
  //   shouldCompileTo('{{true}}', {}, 'IncrementalDOM.text(data[\'true\']);\n');
  //   shouldCompileTo('{{true}}', { '': 'foo' }, 'IncrementalDOM.text(data[\'true\']);\n');
  //   shouldCompileTo('{{false}}', { 'false': 'foo' }, 'IncrementalDOM.text(data[\'false\']);\n');
  // });
  //
  // it.skip('literal paths', function() {
  //   shouldCompileTo('Goodbye {{[@alan]/expression}} world!', {'@alan': {expression: 'beautiful'}},
  //       'IncrementalDOM.text(\'Goodbye \');\nIncrementalDOM.text(data[\'alan\'][\'expression\']);\nIncrementalDOM.text(\' world!\');\n', 'Literal paths can be used');
  //   shouldCompileTo('Goodbye {{[foo bar]/expression}} world!', {'foo bar': {expression: 'beautiful'}},
  //       'IncrementalDOM.text(\'Goodbye \');\nIncrementalDOM.text(data.alan.expression);\nIncrementalDOM.text(\' world!\');\n', 'Literal paths can be used');
  // });
  //
  // it.skip('literal references', function() {
  //   shouldCompileTo('Goodbye {{[foo bar]}} world!', {'foo bar': 'beautiful'}, 'Goodbye beautiful world!');
  //   shouldCompileTo('Goodbye {{"foo bar"}} world!', {'foo bar': 'beautiful'}, 'Goodbye beautiful world!');
  //   shouldCompileTo("Goodbye {{'foo bar'}} world!", {'foo bar': 'beautiful'}, 'Goodbye beautiful world!');
  //   shouldCompileTo('Goodbye {{"foo[bar"}} world!', {'foo[bar': 'beautiful'}, 'Goodbye beautiful world!');
  //   shouldCompileTo('Goodbye {{"foo\'bar"}} world!', {"foo'bar": 'beautiful'}, 'Goodbye beautiful world!');
  //   shouldCompileTo("Goodbye {{'foo\"bar'}} world!", {'foo"bar': 'beautiful'}, 'Goodbye beautiful world!');
  // });
});
