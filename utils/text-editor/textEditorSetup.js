import { languageDef, configuration } from '../../editor/editorConfig';

export default function textEditorSetup(monaco, categories) {
    if (monaco && !monaco.languages.getLanguages().some(({ id }) => id === 'taskLanguage')) {
        monaco.languages.register({ id: 'taskLanguage' });
        monaco.languages.setMonarchTokensProvider('taskLanguage', setLanguageTokens(categories));
        monaco.languages.setLanguageConfiguration('taskLanguage', configuration);

        monaco.languages.registerCompletionItemProvider('taskLanguage', {
          triggerCharacters: ["\\"],
          provideCompletionItems: function (model, position) {
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn - 1,
                endColumn: word.endColumn - 1 
            };
            return {
              suggestions: createDependencyProposals(range, categories)
            };
          }
        });

        monaco.editor.defineTheme("darkTheme", {
          base: 'vs-dark',
          inherit: false,
          rules: setCategoryTokens(categories),
          colors: { 
            "editor.background": "#000000",
            "editor.foreground": "#ffffff",
          },
          scrollBar: {horizontal: 'auto'}
        });
        monaco.editor.setTheme('darkTheme');
      }
}

function createDependencyProposals(range, categories) {
  const suggestions = [
    {
      label: '\\t New task',
      kind: monaco.languages.CompletionItemKind.Constant,
      insertText: 't\\',
      range: range,
    },
    {
      label: '\\d Task Details',
      kind: monaco.languages.CompletionItemKind.Element,
      insertText: 'd\\',
      range: range,
    },
    {
      label: '\\dt Task deadline',
      kind: monaco.languages.CompletionItemKind.Field,
      insertText: 'dt\\',
      range: range,
    },
    {
      label: '\\p1 Lowest priority',
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: 'p\\1',
      range: range,
    },
    {
      label: '\\p2 Low priority',
      kind: monaco.languages.CompletionItemKind.Property,
      insertText: 'p\\2',
      range: range,
    },
    {
      label: '\\p3 Medium priority',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'p\\3',
      range: range,
    },
    {
      label: '\\p4 High priority',
      kind: monaco.languages.CompletionItemKind.Template,
      insertText: 'p\\4',
      range: range,
    },
    {
      label: '\\p5 Highest Priority',
      kind: monaco.languages.CompletionItemKind.Text,
      insertText: 'p\\5',
      range: range,
    }
  ];

  categories?.forEach(category => {
    suggestions.push({
      label: `\\c ${category.name}`, 
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: `c\\${category.name}`,
      range: range,
    });
  });

  return suggestions;
}

function setLanguageTokens(categories) {
  const expandedLanguageDef = {...languageDef};
  categories?.forEach(category => {
    expandedLanguageDef.tokenizer.root.push(
      [new RegExp(`c\\\\${category.name}(?=\\s*dt\\\\)|c\\\\${category.name}(?=\\s*d\\\\)|c\\\\${category.name}(?=\\s*t\\\\)|c\\\\${category.name}(?=\\s*p\\\\)|c\\\\${category.name}(?=\\s*$)|c\\\\${category.name}(?=\\s*\\n)`, 'g'), category.name],
    );
  });
  return expandedLanguageDef;
}

function setCategoryTokens(categories) {
  const categoryTokens = [
    { token: "t", foreground: "#0000ff"},
    { token: "d", foreground: "#00ffff"},
    { token: "uncategorized", foreground: "#ababab"},
    { token: "p1", foreground: "#00ff00"},
    { token: "p2", foreground: "#ffbb00"},
    { token: "p3", foreground: "#ffff00"}, 
    { token: "p4", foreground: "#ff6600"},
    { token: "p5", foreground: "#ff0000"},
    { token: "dt", foreground: "#f000f0"},
    { token: "x", foreground: "#f5f5f5"},
  ]

  categories?.forEach(category => {
    categoryTokens.push(
      {token: category.name, foreground: category.color}
    )
  });
  return categoryTokens;
}