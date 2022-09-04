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
import { mapTasksToEditor, mapSingleTask, mapTaskStructureToEditor } from '../utils/text-editor/taskMapping';
import { useState } from 'react';
import UpdateButton from '../components/text-editor/buttons/UpdateButton';
import { runSyntaxCheck, getChanges, splitContentIntoLines, getFoundTasksPositionAndId, guaranteeCorrectTagSpacing, guaranteeCorrectLineFormat, getTaskComponents, getLineMovemenet, structureEditorContent, mapLineToTask, ensureCorrectLineStartSpacing, displayCompletedTasks } from '../utils/text-editor/textProcessing';
import { Modal, Tooltip } from '@mantine/core';
import { addNewTask } from "../utils/db/queryFunctions/tasks";
import { prismaGetTextEditorStructure, getTextEditorStructure, updateTextEditorStructure } from "../utils/db/queryFunctions/textEditorStructure";
import CalendarSkeleton from '../components/general/loading/CalendarSkeleton';
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
  
  useEffect(() => {
    console.log("prefetchedTheme", prefetchedTheme);
    toggleColorScheme(prefetchedTheme);
  }, [isFetchingTheme]);

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

  function handleEditorDidMount(editor, monaco) {
    textEditorSetup(monaco, categories);
    editor.onDidChangeCursorPosition(e => {
      if(e.position.column < 6) {
        editor.setPosition({
          lineNumber: e.position.lineNumber,
          column: 6
        })
      }
    });

    editor.onDidChangeModelContent(e => setUnManagedContent(editor.getValue()));
    editorRef.current = editor; 
  }

  useEffect(() => {
    if(categories !== undefined && categories !== null && categories.length > 0) {
      textEditorSetup(monaco, categories);
    }
  }, [monaco, categories, tasks, isFetchingTasks, isFetchingCategories, isFetchingTheme, textEditorStructure]);

  useEffect(() => {
    setEditorContent(handleInitialContentSetup());
  }, [isFetchingTasks, isFetchingCategories, textEditorStructure]);

  //TODO: CHECK IF UNMANAGED AND DEBOUNCED
  useEffect(() => {
    const editorLines = splitContentIntoLines(debouncedEditorContent);

    if(editorRef !== null && editorRef.current !== null) {
      const decorations = displayCompletedTasks(editorLines, textDecorations, editorRef);
      setTextDecorations(decorations);
    }

    if(debouncedEditorContent) {
      if(cursorPosition.column < 6) {
        editorRef.setPosition({
          lineNumber: position.lineNumber,
          column: 6
        })
      }

      ensureCorrectLineStartSpacing(debouncedEditorContent);
      // const {isSyntaxValid, errors} = runSyntaxCheck(unManagedContent, categories);
      const {isSyntaxValid, errors} = {isSyntaxValid: true, errors: []};

      setSyntaxErrors(errors);
      setCanUpdate(isSyntaxValid);

      const modif = structureEditorContent(editorLines, tasks); 

      setModifiedContentStructure(modif);
    }
  }, [debouncedEditorContent]);

  const newTaskMutation = useMutation(
    (newTask) => addNewTask(newTask),
    {
      onSuccess: async () => {
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
      onSuccess: async () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const updateTextEditorStructureMutation = useMutation(
    (updatedTextEditorStructure) => updateTextEditorStructure(updatedTextEditorStructure),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('textEditorStructure');
      },
    }
  )

  //FIX INITAL SETUP
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
      setEditorContentStructure(structuredContent);
    }
    return mapTaskStructureToEditor(mappedStructure, tasks, categories);
  }

  function onUpdateButtonClicked() {
    findDifferences();
  }

  function findDifferences() {   
    const newTasks = modifiedContentStructure.filter(line => line.type === 'task' && line.id === undefined);
    const changedTasks = getChanges(editorContentStructure, modifiedContentStructure);
    const deletedTasks = modifiedContentStructure.length > 0
      ? editorContentStructure.filter(line => line.type === 'task' && !modifiedContentStructure.find(modifiedLine => modifiedLine.id === line.id)) 
      : [];

    setChanges({
      newTasks: newTasks,
      deletedTasks: deletedTasks,
      changedTasks: changedTasks,
    })

    if(editorContentStructure.length !== modifiedContentStructure || newTasks.length > 0 || deletedTasks.length > 0 || changedTasks.length > 0) {
      setIsModalOpen(true);
    }
  }

  function handleCursorPosition(position, editor) {

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
        !textEditorStructure && textEditorStructure !== null && textEditorStructure?.length > 0 
        ? <CalendarSkeleton /> 
        : <div>
            <Navbar />
            <div className="flex items-center w-full justify-end px-5">
              {/* <div className="flex items-baseline"> */}
                {!canUpdate && 
                  <ErrorInformation 
                  errors={syntaxErrors}
                  />
                }
                <UpdateButton 
                  canUpdate={canUpdate} 
                  onUpdate={onUpdateButtonClicked}
                />
                <UsageInformation />
              {/* </div> */}
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
            <Modal
              opened={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setChanges({});
              }}
              title="Changes"
              >
              <h1>Caution!</h1>
              <p>You are about to perform these changes:</p>

              {changes.newTasks?.length > 0 
                && 
                <div>
                  <h2 className='text-lg font-bold'>Additions</h2>
                  <ul className='rounded-md my-2 p-2 bg-slate-400'>
                    {changes.newTasks?.map(task => <li className='py-1' key={task.id}>-{task.content}</li>)}
                  </ul>
                </div>
              }
              
              {changes.deletedTasks?.length > 0
                &&
                <div>
                  <h2 className='text-lg font-bold'>Deletions</h2> 
                  <ul className='rounded-md my-2 p-2 bg-slate-400'>
                    {changes.deletedTasks?.map(task => <li className='py-1' key={task.id}>-{task.content}</li>)}
                  </ul>
                </div>
              }

              {changes.changedTasks?.length > 0
                && 
                <div>
                  <h2 className='text-lg font-bold'>Changes</h2>
                  <ul className='rounded-md my-2 p-2 bg-slate-400'>
                    {changes.changedTasks?.map(task => <li className='py-1' key={task.id}>-{task.content}</li>)}
                  </ul>
                </div>
              }

              <button 
                className='bg-green-600 p-2 rounded-md text-white'
                onClick={() => {
                  //ADD DIFERENTIATION BETWEEN CHANGES TO TASKS AND TO STRUCTURE
                  performUpdate();
                  updateTextEditorStructureMutation.mutate({action: 'update', structure: modifiedContentStructure});
                  setEditorContent(mapTaskStructureToEditor(modifiedContentStructure, tasks, categories));
                }} 
              >
                Do it!
              </button>
            </Modal>
        </div>
      }
    </>
  )
}