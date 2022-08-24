import Head from 'next/head'
import Navbar from "../components/general/navbar/Navbar"
import { useEffect } from 'react';
import { useMonaco } from "@monaco-editor/react";
import dynamic from 'next/dynamic';
import { options, languageDef, configuration } from '../editor/editorConfig';
import useDebounce from '../utils/hooks/useDebounce';
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSettings } from '../utils/db/queryFunctions/settings';
import { prismaGetAllTasks, getAllTasks } from '../utils/db/queryFunctions/tasks';
import { prismaGetAllCategories, getAllCategories } from '../utils/db/queryFunctions/categories';
import { getSession } from 'next-auth/react';
import TextEditorSkeleton from '../components/general/loading/TextEditorSkeleton';

export async function getServerSideProps({req, res}) {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { 
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['tasks'], prismaGetAllTasks(session.user.email));
  await queryClient.prefetchQuery(['categories'], prismaGetAllCategories(session.user.email));
  await queryClient.prefetchQuery(['settings'], prismaGetAllCategories(session.user.email));

  const user = await prisma.user.findUnique({
      where: {
          email: session.user.email,
      },
  });

  return {
      props: {
          dehydratedState: dehydrate(queryClient),
          user: JSON.parse(JSON.stringify(user)),
      },
  }
}

const MonacoEditor = dynamic(() => 
  import('@monaco-editor/react'), 
  {
    ssr: false,
  },   
);

function createTagDependencyProposals(range) {
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

export default function TextEditor() {

  const queryClient = useQueryClient();

  const {data: userSettings, isFetching: isFetchingUserSettings} = useQuery(['settings'], getUserSettings);
  const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
  const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco && !monaco.languages.getLanguages().some(({ id }) => id === 'sampleLanguage')) {
      monaco.languages.register({ id: 'sampleLanguage' });
      monaco.languages.setMonarchTokensProvider('sampleLanguage', setLanguageTokens());
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

            return {suggestions: createTagDependencyProposals(range)};
          }
        }
      });
      monaco.editor.defineTheme("sampleTheme", {
        base: "vs-dark",
        inherit: false,
        rules: setCategoryTokens(),
        colors: { 
          "editor.background": "#000000",
          "editor.foreground": "#ffffff",
        },
        scrollBar: {horizontal: 'auto'}
      });
      monaco.editor.setTheme('sampleTheme');
    }
  }, [monaco, categories, isFetchingCategories]);

  function setLanguageTokens() {
    const expandedLanguageDef = {...languageDef};
    categories?.forEach(category => {
      expandedLanguageDef.tokenizer.root.push([new RegExp(`\\\\${category.name}`, 'g'), category.name]);
    });

    return expandedLanguageDef;
  }

  function setCategoryTokens() {
    const categoryTokens = [
      { token: "today", foreground: "#ff0000" },
      { token: "tomorrow", foreground: "#ff0000" },
      { token: "t", foreground: "#0000ff" },
      { token: "p1", foreground: "#00ff00" },
      { token: "p2", foreground: "#ff0000" },
      { token: "p3", foreground: "#ffa200" },
      { token: "p4", foreground: "#ff6600" },
      { token: "p5", foreground: "#ff0000" },
    ]

    categories?.forEach(category => {
      categoryTokens.push({token: category.name, foreground: category.color});
    });

    return categoryTokens;
  }

  function mapTasksToEditor() {
    return tasks?.map(task => 
      `\\t ${task.id} ${task.title} ${mapCategory(task.categoryId)} \\p${task.priority} ${task.dueDate ? mapDate(new Date(task.dueDate)) : ''}\\t `
    ).join('\n')
  }

  function mapId(uuid) {

  }

  function mapCategory(categoryId) {
    const mappedCategory = categoryId !== null && categoryId !== undefined && categoryId !== '' 
      ? `\\${categories?.find(category => category.id === categoryId)?.name}`
      : ''; 	

    return mappedCategory;
  }

  function mapDate(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  }

  function mapSubtasks() {

  }

  function onTextChanged(text) {
    const taskRegex = new RegExp("\\t(.*?)\\t", 'g');
    const foundTasks = text.match(/\\t(.*?)\\t/g);

    console.log("foundTasks", foundTasks);
  }

  return (  
    <div>
        <Navbar />
        <h1>Text Editor</h1>
        <div className='p-5'>
          {isFetchingUserSettings || isFetchingTasks || isFetchingCategories 
          ? <TextEditorSkeleton />
          :<MonacoEditor
            height="80vh"
            language='sampleLanguage'
            options={options}
            theme="sampleTheme"
            value={mapTasksToEditor()}
            onChange={newText => onTextChanged(newText)}
            editorDidMount={editor => { editor.focus() }}
          />}
        </div>
    </div>
  )
}