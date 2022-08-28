import Head from 'next/head'
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
import getThemeColor from '../utils/color/getThemeColor';
import { mapTasksToEditor, mapSingleTask } from '../utils/text-editor/taskMapping';
import { useState } from 'react';
import UpdateButton from '../components/text-editor/buttons/UpdateButton';
import { runSyntaxCheck, getChanges, splitContentIntoLines, getFoundTasksPositionAndId, guaranteeCorrectTagSpacing, guaranteeCorrectLineFormat, getTaskComponents, getLineMovemenet, structureEditorContent, mapLineToTask } from '../utils/text-editor/textProcessing';
import { Modal } from '@mantine/core';
import { addNewTask } from "../utils/db/queryFunctions/tasks";
import { capitalizeFirstLetter } from '../utils/text/textFormatting';


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

  const [editorContentStructure, setEditorContentStructure] = useState([]);
  const [modifiedContentStructure, setModifiedContentStructure] = useState([]);
  
  const [unManagedContent, setUnManagedContent] = useState('');
  const [editorContent, setEditorContent] = useState(() => handleInitialContentSetup());
  const [canUpdate, setCanUpdate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changes, setChanges] = useState([]);
  const debouncedEditorContent = useDebounce(unManagedContent, 500);
  
  const monaco = useMonaco();
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editor.onDidChangeCursorPosition(e => handleCursorPosition(e.position, editor)); 
    editorRef.current = editor; 
  }

  useEffect(() => {
    if(categories !== undefined && categories !== null && categories.length > 0) {
      textEditorSetup(monaco, categories);
    }
  }, [monaco, categories, tasks, isFetchingTasks, isFetchingCategories]);

  useEffect(() => {
    setEditorContent(handleInitialContentSetup());
  }, [isFetchingTasks, isFetchingCategories]);

  useEffect(() => {
    if(debouncedEditorContent) {
      const correctSyntax = runSyntaxCheck(unManagedContent);
      setCanUpdate(correctSyntax);

      const editorLines = splitContentIntoLines(debouncedEditorContent);
      
      setModifiedContentStructure(structureEditorContent(editorLines, tasks));
    }
  }, [debouncedEditorContent]);

  const newTaskMutation = useMutation(
    (newTask) => addNewTask(newTask),
    {
        onMutate: async (newTask) => {
            // console.log("newTask", newTask.id);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries('tasks');
        },
        onSettled: async (data, error, variables, context) => {
            console.log("settled", data.id, error, variables, context);
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
        onMutate: async (newTask) => {
            // console.log("newTask", newTask.id);
        },
        onSuccess: async () => {
          queryClient.invalidateQueries('tasks');
        },
        onSettled: async (data, error, variables, context) => {
            console.log("settled", data.id, error, variables, context);
        }
    }
  );

  function handleInitialContentSetup() {
    let linePosition = 1;
    const structuredContent = tasks?.map(task => {

      const content = mapSingleTask(task, categories);

      let mappedTasks = {
        type: 'task',
        id: task.id,
        startPos: {l: linePosition, c: 0},
        endPos: {l: linePosition, c: content.length},
        content: content,
        components: getTaskComponents(content)
      }

      linePosition += 1;
      return mappedTasks;      
    });
   
    setEditorContentStructure(structuredContent);
    return mapTasksToEditor( tasks, categories);
  }

  function onUpdateButtonClicked() {
    findDifferences();
  }

  function findDifferences() {   
    //1. Check newTasks for task without ID -> NEW 
    const newTasks = modifiedContentStructure.filter(line => line.type === 'task' && line.id === undefined);
    //2. Compare oldStructure with new Structure. IDs present in current but missing in old -> DELETED
    const deletedTasks = editorContentStructure.filter(line => line.type === 'task' && !modifiedContentStructure.find(modifiedLine => modifiedLine.id === line.id));
    // //3. Compare content of all IDs present in current and in old -> UPDATED
    const changedTasks = getChanges(editorContentStructure, modifiedContentStructure);

    setChanges({
      newTasks: newTasks,
      deletedTasks: deletedTasks,
      changedTasks: changedTasks,
    })

    if(newTasks.length > 0 || deletedTasks.length > 0 || changedTasks.length > 0) {
      setIsModalOpen(true);
    }

    //UPDATE TaskSTructure

  }

  function handleCursorPosition(position, editor) {
    // if(position.column < 6) {
    //   editor.setPosition({
    //     lineNumber: position.lineNumber,
    //     column: 6
    //   })
    // }
  }

  return (  
    <div>
        <Navbar />
        <UpdateButton 
          canUpdate={canUpdate} 
          onUpdate={onUpdateButtonClicked}
        />
        <div className='p-5'>
          {isFetchingTasks || isFetchingCategories 
          ? <TextEditorSkeleton />
          :<MonacoEditor
            height="80vh"
            language='sampleLanguage'
            options={options}
            theme="sampleTheme"
            value={editorContent}
            onChange={newText => setUnManagedContent(newText)}
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
              <h2>Additions</h2>
              <ul>
                {changes.newTasks?.map(task => <li key={task.id}>{task.content}</li>)}
              </ul>
            </div>
          }
          
          {changes.deletedTasks?.length > 0
            &&
            <div>
              <h2>Deletions</h2> 
              <ul>
                {changes.deletedTasks?.map(task => <li key={task.id}>{task.content}</li>)}
              </ul>
            </div>
          }

          {changes.changedTasks?.length > 0
            && 
            <div>
              <h2>Changes</h2>
              <ul>
                {changes.changedTasks?.map(task => <li key={task.id}>{task.content}</li>)}
              </ul>
            </div>
          }

          <button
            onClick={() => {

              changes.changedTasks.forEach(task => {
                const updatedTask = mapLineToTask(task, categories);
                updateTaskMutation.mutate(updatedTask);
              });
              changes.newTasks.forEach(task => {
                if(task.components.title !== undefined) {
                  const newTask = mapLineToTask(task, categories);
                  newTaskMutation.mutate(newTask);
                }
              });
              changes.deletedTasks.forEach(task => deleteTaskMutation.mutate(task.id));

              setIsModalOpen(false);
              setChanges({});
            }}
          >
            Do it!
          </button>
        </Modal>
    </div>
  )
}