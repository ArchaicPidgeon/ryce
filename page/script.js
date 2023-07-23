// Generated by CoffeeScript 2.6.1
(function() {
  var array, editorOptions, format, help, input, load, object, output, parse, save, say, select, tokenize, translate;

  libra.global();

  select = html.select;

  ({tokenize, parse, translate} = ryce);

  editorOptions = {
    fontSize: "16pt",
    highlightActiveLine: false,
    highlightGutterLine: false,
    showPrintMargin: false,
    showGutter: true,
    theme: "ace/theme/merbivore"
  };

  input = ace.edit("input");

  input.setOptions(editorOptions);

  output = ace.edit("output");

  output.setOptions(editorOptions);

  output.setReadOnly(true);

  output.renderer.$cursorLayer.element.style.display = "none";

  window.input = input;

  window.output = output;

  format = function(code) {
    return prettier.format(code, {
      parser: 'babel',
      plugins: prettierPlugins
    });
  };

  array = function(...arr) {
    return [...arr];
  };

  object = function(obj) {
    return obj;
  };

  say = function(...args) {
    var newline, text;
    text = output.getValue();
    newline = text.length > 0 ? '\n' : '';
    return output.setValue(text + newline + args.join(' '));
  };

  window.getCompilerOptions = function() {
    var res;
    res = input.getValue().match(/^([ \n]|\[.*?\])*/);
    return res[0];
  };

  save = function() {
    var options, res;
    options = getCompilerOptions();
    res = options.match(/\[save:[ ]+([a-zA-Z0-9]+)\]/);
    if (res) {
      vault.set(res[1], input.getValue());
      return output.setValue(`saved to ${res[1]}`);
    } else {
      return output.setValue("no save name found.");
    }
  };

  load = function(name) {
    // vault.get 'test | input.setValue
    input.setValue(vault.get(name));
    input.gotoLine(0);
    return input.focus();
  };

  load('last');

  select('#controls').onclick = function(evt) {
    var ast, error, jsCode, label, ryCode, tokens;
    try {
      if (!evt.target.classList.contains('button')) {
        return;
      }
      label = evt.target.innerText;
      if (label === 'help') {
        output.setValue(help);
        output.gotoLine(0);
        return;
      }
      ryCode = input.getValue();
      tokens = tokenize(ryCode);
      ast = parse(tokens);
      jsCode = translate(ast);
      vault.set('last', input.getValue());
      if (label === 'tokens') {
        output.setValue((format(JSON.stringify(tokens))).slice(0, -1));
      }
      if (label === 'parse tree') {
        output.setValue((format(`(${JSON.stringify(ast)})`)).slice(0, -1));
      }
      if (label === 'javascript') {
        output.setValue((format(jsCode)).slice(0, -1));
      }
      if (label === 'evaluate') {
        output.setValue('');
        eval(jsCode);
      }
      if (label === 'save') {
        save();
      }
      return output.gotoLine(1000000);
    } catch (error1) {
      error = error1;
      output.setValue('' + error);
      return output.gotoLine(1000000);
    }
  };

  addEventListener("keydown", function(evt) {});

  //log evt
  //evt.preventDefault()
  vault.set("animals", `animals = array #rabits #snakes #whales #ducks
for animal in animals
    say "i like [ animal ]"
say "they are all cute"`);

  help = `to save your code, put "[save: name]" on the first line and click save.
replace name with your own name. names must match "[a-zA-Z0-9]+".

to load your code, write "load #name" in the editor and click "evaluate".

try "load #animals" to see an example program.`;

}).call(this);
