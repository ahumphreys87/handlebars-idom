describe('builtin helpers', function() {
  describe('#if', function() {
    it('if', function() {
      var string = '{{#if goodbye}}GOODBYE {{/if}}cruel {{world}}!';
      var expected = 'if (data.goodbye) {\nIncrementalDOM.text(\'GOODBYE \');\n}\nIncrementalDOM.text(\'cruel \');\nIncrementalDOM.text(data.world);\nIncrementalDOM.text(\'!\');\n';
      shouldCompileTo('if.hbs', 'if.js');
    });

    it.skip('if with function argument', function() {
      var string = '{{#if goodbye}}GOODBYE {{/if}}cruel {{world}}!';
      shouldCompileTo(string, {goodbye: function() {return true; }, world: 'world'}, 'GOODBYE cruel world!',
                      'if with function shows the contents when function returns true');
      shouldCompileTo(string, {goodbye: function() {return this.world; }, world: 'world'}, 'GOODBYE cruel world!',
                      'if with function shows the contents when function returns string');
      shouldCompileTo(string, {goodbye: function() {return false; }, world: 'world'}, 'cruel world!',
                      'if with function does not show the contents when returns false');
      shouldCompileTo(string, {goodbye: function() {return this.foo; }, world: 'world'}, 'cruel world!',
                      'if with function does not show the contents when returns undefined');
    });
  });

  describe('#with', function() {
    it('with', function() {
      shouldCompileTo('with.hbs', 'with.js');
    });
    it.skip('with with function argument', function() {
      var string = '{{#with person}}{{first}} {{last}}{{/with}}';
      shouldCompileTo(string, {person: function() { return {first: 'Alan', last: 'Johnson'}; }}, 'Alan Johnson');
    });
    it.skip('with with else', function() {
      var string = '{{#with person}}Person is present{{else}}Person is not present{{/with}}';
      shouldCompileTo(string, {}, 'Person is not present');
    });
    it.skip('with provides block parameter', function() {
      var string = '{{#with person as |foo|}}{{foo.first}} {{last}}{{/with}}';
      shouldCompileTo(string, {person: {first: 'Alan', last: 'Johnson'}}, 'Alan Johnson');
    });
  });

  describe('#each', function() {
    it('each', function() {
      shouldCompileTo('each.hbs', 'each.js');
    });

    it.skip('each with nested @index', function() {
      var string = '{{#each goodbyes}}{{@index}}. {{text}}! {{#each ../goodbyes}}{{@index}} {{/each}}After {{@index}} {{/each}}{{@index}}cruel {{world}}!';
      var expected = 'for (var i1 in data.goodbyes) {\nIncrementalDOM.text(i1);\nIncrementalDOM.text(\'. \');\nIncrementalDOM.text(data.goodbyes[i1].text);\nIncrementalDOM.text(\'! \');\n}\nIncrementalDOM.text(\'cruel \');\nIncrementalDOM.text(data.world);\nIncrementalDOM.text(\'!\');\n';

      shouldCompileTo(string, {goodbyes: {}, world: 'world'}, expected);
    });

    it.skip('each with block params', function() {
      var string = '{{#each goodbyes as |value index|}}{{index}}. {{value.text}}! {{#each ../goodbyes as |childValue childIndex|}} {{index}} {{childIndex}}{{/each}} After {{index}} {{/each}}{{index}}cruel {{world}}!';
      var hash = {goodbyes: [{text: 'goodbye'}, {text: 'Goodbye'}], world: 'world'};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, '0. goodbye!  0 0 0 1 After 0 1. Goodbye!  1 0 1 1 After 1 cruel world!');
    });

    it.skip('each with @first', function() {
      var string = '{{#each goodbyes}}{{#if @first}}{{text}}! {{/if}}{{/each}}cruel {{world}}!';
      var hash = {goodbyes: [{text: 'goodbye'}, {text: 'Goodbye'}, {text: 'GOODBYE'}], world: 'world'};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, 'goodbye! cruel world!', 'The @first variable is used');
    });

    it.skip('each with nested @first', function() {
      var string = '{{#each goodbyes}}({{#if @first}}{{text}}! {{/if}}{{#each ../goodbyes}}{{#if @first}}{{text}}!{{/if}}{{/each}}{{#if @first}} {{text}}!{{/if}}) {{/each}}cruel {{world}}!';
      var hash = {goodbyes: [{text: 'goodbye'}, {text: 'Goodbye'}, {text: 'GOODBYE'}], world: 'world'};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, '(goodbye! goodbye! goodbye!) (goodbye!) (goodbye!) cruel world!', 'The @first variable is used');
    });

    it.skip('each object with @first', function() {
      var string = '{{#each goodbyes}}{{#if @first}}{{text}}! {{/if}}{{/each}}cruel {{world}}!';
      var hash = {goodbyes: {'foo': {text: 'goodbye'}, bar: {text: 'Goodbye'}}, world: 'world'};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, 'goodbye! cruel world!', 'The @first variable is used');
    });

    it.skip('each with @last', function() {
      var string = '{{#each goodbyes}}{{#if @last}}{{text}}! {{/if}}{{/each}}cruel {{world}}!';
      var hash = {goodbyes: [{text: 'goodbye'}, {text: 'Goodbye'}, {text: 'GOODBYE'}], world: 'world'};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, 'GOODBYE! cruel world!', 'The @last variable is used');
    });

    it.skip('each object with @last', function() {
      var string = '{{#each goodbyes}}{{#if @last}}{{text}}! {{/if}}{{/each}}cruel {{world}}!';
      var hash = {goodbyes: {'foo': {text: 'goodbye'}, bar: {text: 'Goodbye'}}, world: 'world'};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, 'Goodbye! cruel world!', 'The @last variable is used');
    });

    it.skip('each with nested @last', function() {
      var string = '{{#each goodbyes}}({{#if @last}}{{text}}! {{/if}}{{#each ../goodbyes}}{{#if @last}}{{text}}!{{/if}}{{/each}}{{#if @last}} {{text}}!{{/if}}) {{/each}}cruel {{world}}!';
      var hash = {goodbyes: [{text: 'goodbye'}, {text: 'Goodbye'}, {text: 'GOODBYE'}], world: 'world'};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, '(GOODBYE!) (GOODBYE!) (GOODBYE! GOODBYE! GOODBYE!) cruel world!', 'The @last variable is used');
    });

    it.skip('each with function argument', function() {
      var string = '{{#each goodbyes}}{{text}}! {{/each}}cruel {{world}}!';
      var hash = {goodbyes: function() { return [{text: 'goodbye'}, {text: 'Goodbye'}, {text: 'GOODBYE'}]; }, world: 'world'};
      shouldCompileTo(string, hash, 'goodbye! Goodbye! GOODBYE! cruel world!',
                'each with array function argument iterates over the contents when not empty');
      shouldCompileTo(string, {goodbyes: [], world: 'world'}, 'cruel world!',
                'each with array function argument ignores the contents when empty');
    });
  });

  describe.skip('#lookup', function() {
    it('should lookup arbitrary content', function() {
      var string = '{{#each goodbyes}}{{lookup ../data .}}{{/each}}',
          hash = {goodbyes: [0, 1], data: ['foo', 'bar']};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, 'foobar');
    });
    it('should not fail on undefined value', function() {
      var string = '{{#each goodbyes}}{{lookup ../bar .}}{{/each}}',
          hash = {goodbyes: [0, 1], data: ['foo', 'bar']};

      var template = CompilerContext.compile(string);
      var result = template(hash);

      equal(result, '');
    });
  });
});
