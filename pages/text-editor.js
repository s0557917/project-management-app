import Navbar from "../components/general/navbar/Navbar"
import { useEffect, useRef } from 'react';
import { useMonaco } from "@monaco-editor/react";
import dynamic from 'next/dynamic';
import { options } from '../editor/editorConfig';
import useDebounce from '../utils/hooks/useDebounce';
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prismaGetAllTasks, getAllTasks, deleteTask, updateTask } from '../utils/db/queryFunctions/tasks';
import { prismaGetAllCategories, getAllCategories } from '../utils/db/queryFunctions/categories';
import { getSession } from 'next-auth/react';
import TextEditorSkeleton from '../components/general/loading/TextEditorSkeleton';
import textEditorSetup from '../utils/text-editor/textEditorSetup';
import { mapSingleTask, mapTaskStructureToEditor } from '../utils/text-editor/taskMapping';
import { useState } from 'react';
import { runSyntaxCheck, splitContentIntoLines, getTaskComponents, structureEditorContent, mapLineToTask, displayCompletedTasks, compareTasks } from '../utils/text-editor/textProcessing';
import { addNewTask } from "../utils/db/queryFunctions/tasks";
import { prismaGetTextEditorStructure, getTextEditorStructure, updateTextEditorStructure } from "../utils/db/queryFunctions/textEditorStructure";
import ErrorInformation from "../components/text-editor/information/ErrorInformation";
import UsageInformation from "../components/text-editor/information/UsageInformation";
import { useMantineColorScheme } from "@mantine/core";
import { prismaGetTheme, getTheme } from "../utils/db/queryFunctions/settings";

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
  await queryClient.prefetchQuery(['textEditorStructure'], prismaGetTextEditorStructure(session.user.email));
  await queryClient.prefetchQuery(['theme'], prismaGetTheme(session.user.email));

  return {
      props: {
          dehydratedState: dehydrate(queryClient),
      },
  }
}

const MonacoEditor = dynamic(() => 
  import('@monaco-editor/react'), 
  {
    ssr: false,
  },   
);

export default function TextEditor() {

  const queryClient = useQueryClient();

  const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
  const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);
  const {data: textEditorStructure, isFetching: isFetchingTextEditorStructure} = useQuery(['textEditorStructure'], getTextEditorStructure);
  const { data: prefetchedTheme, isFetching: isFetchingTheme } = useQuery(['theme'], getTheme); 

  const { toggleColorScheme } = useMantineColorScheme();
  
  const [editorContentStructure, setEditorContentStructure] = useState([]);
  const [modifiedContentStructure, setModifiedContentStructure] = useState([]);
  
  const [unManagedContent, setUnManagedContent] = useState('');
  const [editorContent, setEditorContent] = useState(() => handleInitialContentSetup());
  const [canUpdate, setCanUpdate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changes, setChanges] = useState([]);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [textDecorations, setTextDecorations] = useState([]);
  const debouncedEditorContent = useDebounce(unManagedContent, 200);
  
  let cursorPosition = {};
  const monaco = useMonaco();
  const editorRef = useRef(null);

  const newTaskMutation = useMutation(
    (newTask) => addNewTask(newTask),
    {
      onSuccess: async (data) => {
        updateTextEditorStructureMutation.mutate(data.id);
        queryClient.invalidateQueries('tasks');
      }
    }
  );

  const updateTaskMutation = useMutation(
    (updatedTask) => updateTask(updatedTask),
    {onSuccess: async () => {
        queryClient.invalidateQueries('tasks');
    }}
)

  const deleteTaskMutation = useMutation(
    (taskId) => deleteTask(taskId),
    {
      onSuccess: async (data) => {
        updateTextEditorStructureMutation.mutate(data.id);
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const updateTextEditorStructureMutation = useMutation(
    (updatedTextEditorStructure) => updateTextEditorStructure(updatedTextEditorStructure),
    {
      onSuccess: async (data) => {
        setEditorContent(mapTaskStructureToEditor(data.textEditorStructure, tasks, categories));
        queryClient.invalidateQueries('textEditorStructure');
      },
    }
  )

  function handleEditorDidMount(editor, monaco) {
    textEditorSetup(monaco, categories);
    editor.onDidChangeModelContent(e => {
      handleCursorPosition(editor.getPosition(), editor);
      setUnManagedContent(editor.getValue())
    });
    editor.onDidChangeCursorSelection(e => {
      handleCursorPosition(editor.getPosition(), editor);
      setUnManagedContent(editor.getValue());
    });
    editor.onDidChangeCursorPosition(e => {
      handleCursorPosition(editor.getPosition(), editor);
      setUnManagedContent(editor.getValue());
    });
    setUnManagedContent(editor.getValue());
    editorRef.current = editor; 
  }

  useEffect(() => {
    toggleColorScheme(prefetchedTheme);
  }, [isFetchingTheme]);

  useEffect(() => {
    if(categories !== undefined && categories !== null && categories.length > 0) {
      textEditorSetup(monaco, categories);
    }
  }, [monaco, categories, tasks, isFetchingTasks, isFetchingCategories, isFetchingTheme, textEditorStructure]);

  useEffect(() => {
    const editorContent = handleInitialContentSetup();
    // console.log("editorContent", editorContent);
    setEditorContent(editorContent);

    if(editorContent && editorContent !== '' && editorContent !== [] && editorContent.length > 0  ) {
      const {isSyntaxValid, errors} = runSyntaxCheck(editorContent, categories);
      setSyntaxErrors(errors);
      setCanUpdate(isSyntaxValid); 
    }

  }, [isFetchingTasks, isFetchingCategories, textEditorStructure]);

  //TODO: CHECK IF UNMANAGED AND DEBOUNCED
  useEffect(() => {
    const {isSyntaxValid, errors} = runSyntaxCheck(unManagedContent, categories);
    setSyntaxErrors(errors);
    setCanUpdate(isSyntaxValid);
    
    const editorLines = splitContentIntoLines(debouncedEditorContent);
    if(editorRef !== null && editorRef.current !== null) {
      const decorations = displayCompletedTasks(editorLines, textDecorations, editorRef);
      setTextDecorations(decorations);
    }
    if(isSyntaxValid) {
      const modif = structureEditorContent(editorLines, tasks); 
      setModifiedContentStructure(modif);

      findChanges();

    }

  }, [debouncedEditorContent]);


  function handleInitialContentSetup() {

    let mappedStructure = [];

    if(textEditorStructure !== undefined && textEditorStructure !== null && textEditorStructure.length > 0) {
      mappedStructure = textEditorStructure;
    } else {
      let linePosition = 1;
      const structuredContent = tasks?.map(task => {
  
        const content = mapSingleTask(task, categories);
  
        let mappedTasks = {
          type: 'task',
          id: task.id,
          startPos: {l: linePosition, c: 0},
          endPos: {l: linePosition, c: content.length},
          content: content,
        }
  
        linePosition += 1;
        return mappedTasks;      
      });
     
      mappedStructure = structuredContent;
    }
    setEditorContentStructure(mappedStructure);
    return mapTaskStructureToEditor(mappedStructure, tasks, categories);
  }

  function findChanges() {   
    // console.log("UNMANAGED", unManagedContent);
    if(editorContentStructure && editorContentStructure !== null && editorContentStructure.length > 0) {     
      const newTasks = modifiedContentStructure.filter(line => line.type === 'task' && line.id === undefined);
      // console.log("newTasks", newTasks);
      // const changedTasks = compareTasks(editorContentStructure, modifiedContentStructure);

      const deletedTasks = modifiedContentStructure.length > 0 && editorContentStructure && editorContentStructure.length > 0
        ? editorContentStructure.filter(line => line.type === 'task' && !modifiedContentStructure.find(modifiedLine => modifiedLine.id === line.id)) 
        : [];
      // console.log("deletedTasks", deletedTasks);
    }
  }

  function handleCursorPosition(position, editor) {
    // console.log("CURSOR POSITION", position);
    if (position.column < 6) {
      console.log("SMALLER -- ", position)
      editor.setPosition({lineNumber: position.lineNumber, column: 6});
    }
  }

  function performUpdate() {
    changes.changedTasks.forEach(task => {
      const updatedTask = mapLineToTask(task, categories);
      updateTaskMutation.mutate(updatedTask);
    });
    changes.newTasks.forEach(task => {
      const taskComponents = getTaskComponents(task.content);
      if(taskComponents.title !== undefined) {
        const newTask = mapLineToTask(task, categories);
        newTaskMutation.mutate(newTask);
      }
    });
    changes.deletedTasks.forEach(task => deleteTaskMutation.mutate(task.id));

    setIsModalOpen(false);
    setChanges({});
  }

  return (  
    <>
      {
        <div>
            <Navbar />
            <div className="flex items-center w-full justify-end px-5">
                {!canUpdate && 
                  <ErrorInformation 
                  errors={syntaxErrors}
                  />
                }
                <UsageInformation />
            </div>
            <div className='px-5 pt-2'>
              {isFetchingTasks || isFetchingCategories 
              ? <TextEditorSkeleton />
              :<MonacoEditor
                height="80vh"
                language='taskLanguage'
                options={options}
                theme="sampleTheme"
                value={editorContent}
                onMount={handleEditorDidMount}
              />}
            </div>
        </div>
      }
    </>
  )
}