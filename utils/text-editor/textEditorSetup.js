import { languageDef, configuration } from '../../editor/editorConfig';
import { capitalizeFirstLetter } from '../text/textFormatting';

export default function textEditorSetup(monaco, categories) {
    if (monaco && !monaco.languages.getLanguages().some(({ id }) => id === 'sampleLanguage')) {
        monaco.languages.register({ id: 'sampleLanguage' });
        monaco.languages.setMonarchTokensProvider('sampleLanguage', setLanguageTokens(categories));
        monaco.languages.setLanguageConfiguration('sampleLanguage', configuration);
        // monaco.languages.registerCompletionItemProvider('sampleLanguage', {
        //   triggerCharacters: ['.', ' ', '\\'],
        // });
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
      // else if(monaco && monaco.languages.getLanguages().some(({ id }) => id === 'sampleLanguage')){
      //   monaco.languages.setMonarchTokensProvider('sampleLanguage', setLanguageTokens(categories));
      //   monaco.languages.setLanguageConfiguration('sampleLanguage', configuration);
      // }
}

// function createTagDependencyProposals(range, monaco) {
//     return [
//           {
//               label: '\\"lodash"',
//               kind: monaco.languages.CompletionItemKind.Function,
//               documentation: 'The Lodash library exported as Node.js modules.',
//               insertText: '"lodash": "*"',
//               range: range
//           },
//     ]
// }

function setLanguageTokens(categories) {
  const expandedLanguageDef = {...languageDef};
  categories?.forEach(category => {
    expandedLanguageDef.tokenizer.root.push(
      [new RegExp(`c\(${category.name}\)`, 'g'), category.name],
      [new RegExp(`category\(${category.name}\)`, 'g'), category.name]
    );
  });
    
  console.log("EXPANDED, ", categories, expandedLanguageDef);
  // console.log("EXPANDED, ", expandedLanguageDef);
  // return expandedLanguageDef;
  return languageDef;
}

function setCategoryTokens(categories) {
  const categoryTokens = [
    { token: "today", foreground: "#ff0000" },
    { token: "tomorrow", foreground: "#ff0000" },
    { token: "p(1)", foreground: "#00ff00" },
    { token: "p(2)", foreground: "#ff0000" },
    { token: "p(3)", foreground: "#ffa200" },
    { token: "p(4)", foreground: "#ff6600" },
    { token: "p(5)", foreground: "#ff0000" },
    { token: "priority(5)", foreground: "#ff0000" },
    { token: "priority(1)", foreground: "#00ff00" },
    { token: "priority(2)", foreground: "#ff0000" },
    { token: "priority(3)", foreground: "#ffa200" },
    { token: "priority(4)", foreground: "#ff6600" },
    { token: "priority(5)", foreground: "#ff0000" },
    { token: "t()", foreground: "#0000ff" },
    { token: "title()", foreground: "#00ffff" },
    { token: "d()", foreground: "#00ffff" },
    { token: "details()", foreground: "#0000ff" },
    { token: "dt()", foreground: "#00ffff" },
    { token: "datetime()", foreground: "#00ffff" },
    { token: "uncategorized", foreground: "#ababab" },
    { token: "c(Uncategorized)", foreground: "#ababab" },
  ]

  categories?.forEach(category => {
    categoryTokens.push(
      {token: `c(${category.name})`, foreground: category.color},
      {token: `category(${category.name})`, foreground: category.color}
    )
  });

  return categoryTokens;
}