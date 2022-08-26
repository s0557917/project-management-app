import Head from 'next/head'
import Navbar from "../components/general/navbar/Navbar"
import { useEffect } from 'react';
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
import mapTasksToEditor from '../utils/text-editor/taskMapping';
import { useState } from 'react';

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

  const taskStructure = [];

  const [editorContent, setEditorContent] = useState(() => handleTasks());

  const monaco = useMonaco();
  useEffect(() => {
    textEditorSetup(monaco, categories);
  }, [monaco, categories, isFetchingCategories]);

  useEffect(() => {
    setEditorContent(handleTasks());
  }, [isFetchingTasks, isFetchingCategories]);

  function handleTasks() {
    let linePosition = 1;
    tasks?.forEach(task => {
      taskStructure.push({id: task.title, position: linePosition});
      linePosition = task.subtasks.length > 0 
        ? linePosition + 1 + task.subtasks.length 
        : linePosition + 1;
    });
    console.log('taskStructure', taskStructure);
    return mapTasksToEditor( tasks, categories);
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
          {isFetchingTasks || isFetchingCategories 
          ? <TextEditorSkeleton />
          :<MonacoEditor
            height="80vh"
            language='sampleLanguage'
            options={options}
            theme="sampleTheme"
            value={editorContent}
            onChange={newText => onTextChanged(newText)}
            editorDidMount={editor => { editor.focus() }}
          />}
        </div>
    </div>
  )
}