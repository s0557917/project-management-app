const comment = /^\s*#([ =|].*)?$/

/* eslint-disable quotes */

// This config defines the editor's view.
export const options = {
  // lineNumbersMinChars: 9,
  // lineNumbers: num => `a6sb ${String(num).padStart(2, '0')}`,
  scrollBeyondLastLine: false,
  readOnly: false,
  fontSize: 14,
}

// This config defines how the language is displayed in the editor.
export const languageDef = {
  defaultToken: "invalid",
  number: /\d+(\.\d+)?/,
  keywords: [],
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },
      { include: "@tags" },
      [/^@\w+/, { cases: { "@keywords": "keyword" } }],
      [/t\(.*?\)/g, "t()"],
      [/title\(.*?\)/g, "title()"],
      [/d\(.*?\)/g, "d()"],
      [/details\(.*?\)/g, "details()"],
      [/p\(1\)/g, "p(1)"],
      [/p\(2\)/g, "p(2)"],
      [/p\(3\)/g, "p(3)"],
      [/p\(4\)/g, "p(4)"],
      [/p\(5\)/g, "p(5)"],
      [/priority\(1\)/g, "priority(1)"],
      [/priority\(2\)/g, "priority(2)"],
      [/priority\(3\)/g, "priority(3)"],
      [/priority\(4\)/g, "priority(4)"],
      [/priority\(5\)/g, "priority(5)"],
      [/dt\(.*?\)/g, "dt()"],
      [/datetime\(.*?\)/g, "datetime()"],
      [/\\today/g, "today"],
      [/\\tomorrow/g, "tomorrow"],
      [/c\(Uncategorized\)/g, "c(Uncategorized)"],
    ],
    whitespace: [],
    numbers: [],
    strings: [],
    tags: [],
  },
}

// This config defines the editor's behavior.
export const configuration = {
  comments: {
    lineComment: "#",
  },
  brackets: [
    ["{", "}"], 
    ["[", "]"], 
    ["(", ")"], 
    ["\\t", "t\\"], 
    ["\\s", "s\\"],
    ["t(", ")"],
    ["title(", ")"],
    ["d(", ")"],
    ["details(", ")"],
    ["p(", ")"],
    ["priority(", ")"],
    ["c(", ")"],
    ["category(", ")"],
  ],
}