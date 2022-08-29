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
import { mapTasksToEditor, mapSingleTask } from '../utils/text-editor/taskMapping';
import { useState } from 'react';
import UpdateButton from '../components/text-editor/buttons/UpdateButton';
import { runSyntaxCheck, getChanges, splitContentIntoLines, getFoundTasksPositionAndId, guaranteeCorrectTagSpacing, guaranteeCorrectLineFormat, getTaskComponents, getLineMovemenet, structureEditorContent, mapLineToTask } from '../utils/text-editor/textProcessing';
import { Modal } from '@mantine/core';
import { addNewTask } from "../utils/db/queryFunctions/tasks";


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
  
  let cursorPosition = {};
  const monaco = useMonaco();
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editor.onDidChangeCursorPosition(e => handleCursorPosition(e.position, editor)); 
    editor.onDidChangeModelContent(e => setUnManagedContent(editor.getValue()));
    editor.addAction({
      // An unique identifier of the contributed action.
      id: 'my-unique-id',
    
      // A label of the action that will be presented to the user.
      label: 'My Label!!!',
    
      // An optional array of keybindings for the action.
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        )
      ],
    
      // A precondition for this action.
      precondition: null,
      run: () => findDifferences(),
    });
    editor.addAction({
      // An unique identifier of the contributed action.
      id: 'enterAction',
    
      // A label of the action that will be presented to the user.
      label: 'My Label!!!',
    
      // An optional array of keybindings for the action.
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyCode.Enter,
        )
      ],
    
      // A precondition for this action.
      precondition: null,
      run: () => {
        const lineContent = editor.getModel().getLineContent(cursorPosition.lineNumber);
        const lineHasTask = lineContent.match(/(?<=(?<!d)t\().*?(?=\))/);
        const editorLineCount = editor.getModel().getLineCount();
        const linesToModify = editorLineCount - cursorPosition.lineNumber;

        const range = {};
        let newContent = '';

        if(lineHasTask !== null && lineContent.substring(0, cursorPosition.column - 1).match(/(?<=(?<!d)t\().*?(?=\))/) === null ) {
          range.startLine = cursorPosition.lineNumber;
          range.startColumn = 1;
          range.endLine = editorLineCount;
          range.endColumn = editor.getModel().getLineContent(editorLineCount).length;

          for(let i=0; i<linesToModify; i++) {
            if(i === 0)newContent += '\n';
            newContent += editor.getModel().getLineContent(cursorPosition.lineNumber + i) + '\n';
          }
        } else {
          range.startLine = cursorPosition.lineNumber;
          range.startColumn = cursorPosition.column;
          range.endLine = cursorPosition.lineNumber;
          range.endColumn = cursorPosition.column;

          newContent += '\n';
        }
        
        editor.executeEdits(
          "$model1", 
          [
            { 
              identifier: "my-ident", 
              range: new monaco.Range (
                range.startLine, 
                range.startColumn, 
                range.endLine, 
                range.endColumn
              ), 
              text: newContent 
            }
          ]
        );
      },
    });

    
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
      const correctSyntax = runSyntaxCheck(unManagedContent, categories);
      setCanUpdate(correctSyntax);

      const editorLines = splitContentIntoLines(debouncedEditorContent);
      const temp = structureEditorContent(editorLines, tasks);
      setModifiedContentStructure(temp);
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
    console.log("FD: FIND INDEX CALLED", modifiedContentStructure);
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
    console.log("CHANGES", changes);
    if(newTasks.length > 0 || deletedTasks.length > 0 || changedTasks.length > 0) {
      setIsModalOpen(true);
    }
  }

  function handleCursorPosition(position, editor) {
    console.log("POSITION", position);
    cursorPosition = position;
    if(position.column < 6) {
      editor.setPosition({
        lineNumber: position.lineNumber,
        column: 6
      })
    }
  }

  function performUpdate() {
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
            onClick={() => performUpdate} 
          >
            Do it!
          </button>
        </Modal>
    </div>
  )
}