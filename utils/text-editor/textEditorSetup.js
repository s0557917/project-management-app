import { languageDef, configuration } from '../../editor/editorConfig';
import { capitalizeFirstLetter } from '../text/textFormatting';

export default function textEditorSetup(monaco, categories) {
    if (monaco && !monaco.languages.getLanguages().some(({ id }) => id === 'sampleLanguage')) {
        monaco.languages.register({ id: 'sampleLanguage' });
        monaco.languages.setMonarchTokensProvider('sampleLanguage', setLanguageTokens(categories));
        monaco.languages.setLanguageConfiguration('sampleLanguage', configuration);
        monaco.languages.registerCompletionItemProvider('sampleLanguage', {
          triggerCharacters: ['.', ' '],
          provideCompletionItems: (model, position) => {
            // find out if we are completing a property in the 'dependencies' object.
            var textUntilPosition = model.getValueInRange({
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            });
            // /(\\t.*($|\n))/g
            // ([a-zA-Z]+)((?:\\.[a-zA-Z]+)*)
            // var tagMatch = textUntilPosition.match(/\\t/g);
            // var todayMatch = textUntilPosition.match(/\\today/g);
            // var testMatch = textUntilPosition.match(/cheese/g)
            var match = textUntilPosition.match(/"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/);
            if (!match) {
              return { suggestions: [] };
            } else {
              var word = model.getWordUntilPosition(position);
              var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
              };
  
              return {suggestions: createTagDependencyProposals(range, monaco)};
            }
          }
        });
        monaco.editor.defineTheme("sampleTheme", {
          base: 'vs-dark',
          inherit: false,
          rules: setCategoryTokens(categories),
          colors: { 
            "editor.background": "#000000",
            "editor.foreground": "#ffffff",
          },
          scrollBar: {horizontal: 'auto'}
        });
        monaco.editor.setTheme('sampleTheme');
      }
}

function createTagDependencyProposals(range, monaco) {
    return [
          {
              label: '\\"lodash"',
              kind: monaco.languages.CompletionItemKind.Function,
              documentation: 'The Lodash library exported as Node.js modules.',
              insertText: '"lodash": "*"',
              range: range
          },
    ]
}

function setLanguageTokens(categories) {
    const expandedLanguageDef = {...languageDef};
    categories?.forEach(category => {
      expandedLanguageDef.tokenizer.root.push([new RegExp(`\\\\${category.name}`, 'g'), category.name]);
    });

    return expandedLanguageDef;
}

function setCategoryTokens(categories) {
    const categoryTokens = [
      { token: "today", foreground: "#ff0000" },
      { token: "tomorrow", foreground: "#ff0000" },
      { token: "\\t", foreground: "#0000ff" },
      { token: "t\\", foreground: "#0000ff" },
      { token: "p1", foreground: "#00ff00" },
      { token: "p2", foreground: "#ff0000" },
      { token: "p3", foreground: "#ffa200" },
      { token: "p4", foreground: "#ff6600" },
      { token: "p5", foreground: "#ff0000" },
      { token: "\\s", foreground: "#00ffff" },
      { token: "s\\", foreground: "#00ffff" },
      { token: "uncategorized", foreground: "#ababab" },
    ]

    categories?.forEach(category => {
      categoryTokens.push({token: capitalizeFirstLetter(category.name).replace(' ', ''), foreground: category.color});
    });

    return categoryTokens;
  }