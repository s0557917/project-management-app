import Head from 'next/head'
import Navbar from "../components/general/navbar/Navbar"
import { useEffect, useRef } from 'react';
import { useMonaco } from "@monaco-editor/react";
import dynamic from 'next/dynamic';
import { options } from '../editor/editorConfig';
import useDebounce from '../utils/hooks/useDebounce';
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prismaGetAllTasks, getAllTasks } from '../utils/db/queryFunctions/tasks';
import { prismaGetAllCategories, getAllCategories } from '../utils/db/queryFunctions/categories';
import { getSession } from 'next-auth/react';
import TextEditorSkeleton from '../components/general/loading/TextEditorSkeleton';
import textEditorSetup from '../utils/text-editor/textEditorSetup';
import getThemeColor from '../utils/color/getThemeColor';
import { mapTasksToEditor, mapSingleTask } from '../utils/text-editor/taskMapping';
import { useState } from 'react';
import UpdateButton from '../components/text-editor/buttons/UpdateButton';
import { runSyntaxCheck, getChanges, splitContentIntoLines, getFoundTasksPositionAndId, guaranteeCorrectTagSpacing, guaranteeCorrectLineFormat, getTaskComponents } from '../utils/text-editor/textProcessing';
import { Modal } from '@mantine/core';

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

  const [taskStructure, setTaskStructure] = useState([]);
  const [foundTasksWithPosition, setFoundTasksWithPosition] = useState([]);
  
  const [unManagedContent, setUnManagedContent] = useState('');
  const [editorContent, setEditorContent] = useState(() => handleInitialContentSetup());
  const [canUpdate, setCanUpdate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changes, setChanges] = useState([]);
  const debouncedEditorContent = useDebounce(unManagedContent, 500);
  
  const monaco = useMonaco();
  
  const editorRef = useRef(null);
  function handleEditorDidMount(editor, monaco) {
    editor.focus();
    editorRef.current = editor; 
  }

  useEffect(() => {
    textEditorSetup(monaco, categories);
  }, [monaco, categories, isFetchingCategories]);

  useEffect(() => {
    setEditorContent(handleInitialContentSetup());
  }, [isFetchingTasks, isFetchingCategories]);

  useEffect(() => {
    if(debouncedEditorContent) {
      const correctSyntax = runSyntaxCheck(unManagedContent);
      setCanUpdate(correctSyntax);

      const foundTasks = unManagedContent.match(/\\t(.*?)t\\/g);
      const editorContentLines = guaranteeCorrectTagSpacing(splitContentIntoLines(debouncedEditorContent));
      
      setFoundTasksWithPosition(getFoundTasksPositionAndId(foundTasks, editorContentLines, tasks));
    }
  }, [debouncedEditorContent]);

  function findDifferences() {
    console.log("foundTasksWithPosition", foundTasksWithPosition);
    
    //0. Format lines -> 
    const tasksWithComponents = getTaskComponents(foundTasksWithPosition);
    console.log( "tasksWithComponents", tasksWithComponents);
    //1. Check newTasks for task without ID -> NEW 
    const newTasks = tasksWithComponents.filter(task => task.id === undefined);
    
    //2. Compare oldStructure with new Structure. IDs present in current but missing in old -> DELETED
    const deletedTasks = taskStructure.filter(task => tasksWithComponents.find(oldTask => oldTask.id === task.id) === undefined);

    //3. Compare content of all IDs present in current and in old -> UPDATED
    const changedTasks = getChanges(taskStructure, tasksWithComponents);
    
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

  function handleInitialContentSetup() {
    let linePosition = 1;
    const mappedTasksWithoutStructure = tasks?.map(task => {

      const content = mapSingleTask(task, categories).match(/(?<=\\t)(.*)(?=t\\)/g)[0].trim();

      let mappedTasks = {
        type: 'task',
        id: task.id,
        startPos: {l: linePosition + 1, c: 0},
        endPos: {l: linePosition, c: content.length},
        content: content,
      }

      linePosition += 1;
      return mappedTasks;      
    });
   
    const structure = getTaskComponents(mappedTasksWithoutStructure);
    setTaskStructure(structure);
    return mapTasksToEditor( tasks, categories);
  }

  function onUpdateButtonClicked() {
    findDifferences();
  }

  return (  
    <div>
        <Navbar />
        <h1>Text Editor</h1>
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
        </Modal>
    </div>
  )
}