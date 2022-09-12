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
      [/x\\.*|.*x\\/g, "x"],
      [/(?<!d)t\\.*?(?=[t|c|d|dt|p][t|c|d|dt|p]?\\)|(?<!d)t\\.*(?=$)|(?<!d)t\\.*(?=\n)/g, "t"],
      [/d\\.*?(?=[a-z|A-Z][a-z|A-Z]?\\)|d\\.*(?=$)|d\\.*(?=\n)/g, "d"],
      [/c\\Uncategorized(?=\s*dt\\)|c\\Uncategorized(?=\s*d\\)|c\\Uncategorized(?=\s*t\\)|c\\Uncategorized(?=\s*p\\)|c\\Uncategorized(?=\s*$)|c\\Uncategorized(?=\s*\n)/g, "uncategorized"],
      [/p\\1(?=\s*)|p\\1(?=\s*$)|p\\1(?=\s*\n)/g, "p1"],
      [/p\\2(?=\s*)|p\\2(?=\s*$)|p\\2(?=\s*\n)/g, "p2"],
      [/p\\3(?=\s*)|p\\3(?=\s*$)|p\\3(?=\s*\n)/g, "p3"],
      [/p\\4(?=\s*)|p\\4(?=\s*$)|p\\4(?=\s*\n)/g, "p4"],
      [/p\\5(?=\s*)|p\\5(?=\s*$)|p\\5(?=\s*\n)/g, "p5"],
      [/(dt\\\d{2}-\d{2}-\d{4} \d{2}:\d{2}-\d{2}:\d{2}(?=(\s*$|\s*\n|\s*[t|c|d|p|x]\\)))|(dt\\\d{2}-\d{2}-\d{4}(?=(\s*$|\s*\n|\s*[t|c|d|p|x]\\)))/g, "dt"],
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
  ],
}