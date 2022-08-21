const comment = /^\s*#([ =|].*)?$/

/* eslint-disable quotes */

// This config defines the editor's view.
export const options = {
  lineNumbers: true,
  scrollBeyondLastLine: true,
  readOnly: false,
  fontSize: 16,
}

// This config defines how the language is displayed in the editor.
export const languageDef = {
  defaultToken: "",
  number: /\d+(\.\d+)?/,
  keywords: [
    // "@project",
    // "@participants",
    // "@summary",
    // "@rounding",
    // "@tomato",
  ],
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },
      { include: "@tags" },
      [/^@\w+/, { cases: { "@keywords": "keyword" } }],
      [/(\\p1)(?=[\s\S]*\\t)/gm, "p1"],
      [/\\p2/g, "p2"],
      [/\\p3/g, "p3"],
      [/\\p4/g, "p4"],
      [/\\p5/g, "p5"],
      [/\\t(?!oday|omorrow)/g, "t"],
      [/\\today/g, "today"],
      [/\\tomorrow/g, "tomorrow"],
      
    ],
    whitespace: [
      // [comment, "comment"],
      // [/\s+/, "white"],
    ],
    numbers: [
      // [/@number/, "number"],
    ],
    strings: [
      // [/[=|][ @number]*$/, "string.escape"],
      // TODO: implement invalid strings
    ],
    tags: [
      // [/\\t/g, "t"],
      // [/\\today/g, "today"],
      // [/\\tomorrow/g, "tomorrow"],
      // [/\\p1/g, "p1"],
      // [/\\p2/g, "p2"],
      // [/\\p3/g, "p3"],
      // [/\\p4/g, "p4"],
      
    ],
  },
}

// This config defines the editor's behavior.
export const configuration = {
  comments: {
    lineComment: "#",
  },
  brackets: [
    ["{", "}"], ["[", "]"], ["(", ")"], ["\\t", "\\t"]
  ],
}