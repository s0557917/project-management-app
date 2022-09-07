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
import { runSyntaxCheck, splitContentIntoLines, getTaskComponents, structureEditorContent, mapLineToTask, displayCompletedTasks, areLinesEqual, getLinesWithContent } from '../utils/text-editor/textProcessing';
import { addNewTask } from "../utils/db/queryFunctions/tasks";
import { prismaGetTextEditorStructure, getTextEditorStructure, updateTextEditorStructure } from "../utils/db/queryFunctions/textEditorStructure";
import ErrorInformation from "../components/text-editor/information/ErrorInformation";
import UsageInformation from "../components/text-editor/information/UsageInformation";
import { useMantineColorScheme } from "@mantine/core";
import { prismaGetTheme, getTheme } from "../utils/db/queryFunctions/settings";
import { v4 as uuidv4 } from 'uuid';

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
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [textDecorations, setTextDecorations] = useState([]);
  const debouncedEditorContent = useDebounce(unManagedContent, 1000);
  const [editorChanges, setEditorChanges] = useState([]);	
  
  let cursorPosition = {};
  const monaco = useMonaco();
  const editorRef = useRef(null);

  const newTaskMutation = useMutation(
    (newTask) => addNewTask(newTask),
    {
        onSuccess: async (data) => {
            queryClient.invalidateQueries('tasks');
            showNotification({
                autoClose: 3000,
                type: 'success',
                color: 'green',
                title: 'New task saved successfully!',
            });
        },
    }
);

  const updateTaskMutation = useMutation(
    (updatedTask) => updateTask(updatedTask),
    {onSuccess: async (data) => {
      console.log('Task updated successfully!', data);
        queryClient.invalidateQueries('tasks');
    }}
)

  const deleteTaskMutation = useMutation(
    (taskId) => deleteTask(taskId),
    {
      onSuccess: async (data) => {
        newTaskTextEditorStructureMutation.mutate(data.id);
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const updateTextEditorStructureMutation = useMutation(
    (updatedTextEditorStructure) => updateTextEditorStructure({structure: updatedTextEditorStructure, action: 'update'}),
    {
      onSuccess: async (data) => {
        setEditorContent(mapTaskStructureToEditor(data.textEditorStructure, tasks, categories));
        queryClient.invalidateQueries('textEditorStructure');
      },
    }
  )

  const newTaskTextEditorStructureMutation = useMutation(
    (taskId) => updateTextEditorStructure({taskId, action: 'add'}),
    {
        onSuccess: () => {
            queryClient.invalidateQueries('textEditorStructure');
        }
    }
  )

  const deleteTaskTextEditorStructureMutation = useMutation(
    (taskId) => updateTextEditorStructure({taskId, action: 'delete'}),
    {
        onSuccess: () => {
            queryClient.invalidateQueries('textEditorStructure');
        }
    }
  )

  function handleEditorDidMount(editor, monaco) {
    textEditorSetup(monaco, categories);
    editor.onDidChangeModelContent(e => {
      handleCursorPosition(editor.getPosition(), editor);
      setUnManagedContent(editor.getValue());
      const changeObject = {changes: e.changes, timestamp: Date.now(), cursorPosition: editor.getPosition()};
      setEditorChanges(prevEditorChanges => [...prevEditorChanges, changeObject]);
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
  }, []);
  //monaco, categories, tasks, isFetchingTasks, isFetchingCategories, isFetchingTheme, textEditorStructure

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
    } else {
      setEditorChanges([]);
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
          id: task.id,
          startPos: {l: linePosition, c: 0},
          endPos: {l: linePosition, c: content.length},
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
    const deletedTasks = [];
    const newTasks = [];
    const modifiedTasks = [];
    
    let modifiedStructure = editorContentStructure; 
    console.log("CONTENT STRU", modifiedContentStructure);

    if(editorChanges && editorChanges.length > 0) {

      const oldEditorLines = splitContentIntoLines(editorContent);
      const newEditorLines = splitContentIntoLines(unManagedContent);

      const swaps = editorChanges.filter(change => change.changes.length == 2).sort((a, b) => a.timestamp - b.timestamp);
      const uniqueChanges = getUniqueLineChanges(editorChanges.filter(change => change.changes.length === 1).sort((a, b) => a.timestamp - b.timestamp));
      console.log("uniqueChanges", uniqueChanges);
      if(uniqueChanges && uniqueChanges.length > 0) {
        uniqueChanges.forEach(change => {

          const modifiedTask = editorContentStructure?.find(line => {
            return line.startPos.l === change.range.startLineNumber;
          });

          if(modifiedTask) {
            if(oldEditorLines.length > newEditorLines.length && change.text === '' && change.range.startLineNumber !== change.range.endLineNumber) {
              //TODO FIX MULTIPLE LINE DELETTIO INCLUDING CURSOR LINE
              const deletedLineRange = determineDeletedLineRange(change);
              const increment = Math.max(change.range.startLineNumber, change.range.endLineNumber) - Math.min(change.range.startLineNumber, change.range.endLineNumber);
              deletedTasks.push(modifiedStructure.filter(line => deletedLineRange.includes(line.startPos.l)).map(line => line.id));
              modifiedStructure = modifiedStructure.filter(line => !deletedLineRange.includes(line.startPos.l));
              modifiedStructure = moveTasks(determineDeletionDirection(change), change.range.startLineNumber, modifiedStructure, increment);
              console.log("DELETE", modifiedStructure);

            } else if(oldEditorLines.length < newEditorLines.length && change.text !== '\n') {
              //NEW TASK
              const newTaskId = uuidv4();
              const position = {
                startPos: {l: change.range.startLineNumber, c: 1},
                endPos: {l: change.range.startLineNumber, c: newEditorLines[change.range.startLineNumber].length},
              };
              newTasks.push({position: position, taskId: newTaskId, components: getTaskComponents(newEditorLines[change.range.startLineNumber - 1])});
              modifiedStructure = moveTasks('down', change.range.startLineNumber, modifiedStructure);
              modifiedStructure[change.range.startLineNumber] = { 
                id: newTaskId,
                startPos: position.startPos,
                endPos: position.endPos, 
                components: getTaskComponents(newEditorLines[change.range.startLineNumber - 1])
              };

              console.log("NEW TASK", modifiedStructure);
            } else {
                const { areEqual, components } = areLinesEqual(oldEditorLines[change.range.startLineNumber - 1], newEditorLines[change.range.startLineNumber - 1]);
                if(modifiedTask.id && !areEqual) {
                  modifiedTasks.push({id: modifiedTask.id, components: components});
              }
            }
          }
        })
      }
      if ( swaps && swaps.length > 0 ) {
        swaps.forEach(swap => {
          const endLine = swap.changes[0].range.endLineNumber;
          const startLine = swap.changes[1].range.startLineNumber === endLine 
            ? swap.changes[0].range.startLineNumber
            : swap.changes[1].range.startLineNumber; 

          const firstTask = editorContentStructure.find(line => line.startPos.l === startLine);
          const secondTask = editorContentStructure.find(line => line.startPos.l === endLine);

          const tempLineHolder = secondTask.startPos.l;
          secondTask.startPos.l = firstTask.startPos.l;
          firstTask.startPos.l = tempLineHolder;  

          modifiedStructure[startLine - 1] = secondTask;
          modifiedStructure[endLine - 1] = firstTask;
          console.log("SWAP", modifiedStructure);
        });
      }

      console.log("DELETED TASKS", deletedTasks);
      console.log("NEW TASKS", newTasks);
      console.log("MODIFIED TASKS", modifiedTasks);

      newTaskMutation.mutate(newTasks.map(task => {
        return {
          id: task.taskId,
          title: task.components.title,
          details: task.components.details || '',
          categoryId: categories?.find(category => category.name === task.components.category)?.id || '',
          dueDate: new Date(task.components.dueDate) || null,
          priority: task.components.priority || 1,
          completed: task.components.completed || false,
          start: null,
          end: null,
          reminders: null,
          subtasks: null,
        }
      }))

      modifiedTasks.forEach(task => {
        const updatedTask = {
          id: task.id,
          title: task.components.title,
          details: task.components.details || '',
          categoryId: categories?.find(category => {
            return category.name.trim() === task.components.category.trim()
          })?.id || '',
          dueDate: null,
          priority: task.components.priority || 1,
          completed: task.components.isCompleted || false,
          start: null,
          end: null,
          reminders: null,
          subtasks: null,
        }
        console.log("UPDATED TASK", updatedTask);
        // new Date(task.components.dueDate) 
        updateTaskMutation.mutate(updatedTask);
      });
      
      console.log("MODIFIED STRUCTURE", modifiedStructure);
      setEditorContentStructure(modifiedStructure);
      setEditorChanges([]);
      setEditorContent(unManagedContent);
      updateTextEditorStructureMutation.mutate(modifiedStructure);
    }
  }

  
  function getUniqueLineChanges(changes) {
    if(changes && changes.length > 0) {
      if(changes.length > 1 ) {
        let groups = changes
        .filter(changeObject => changeObject.changes.length === 1)
        .reduce((groups, changeObject) => {
          const group = (groups[changeObject.changes[0].range.startLineNumber] || []);
          group.push({...changeObject, cursorPosition: changeObject.cursorPosition});
          groups[changeObject.changes[0].range.startLineNumber] = group;
          return groups;
        }, {});

        groups = Object.entries(groups).map(group => {
          if(group[1].length > 1) {
            const latest = Math.max(...group[1].map(change => change.timestamp))
            const ch = group[1].filter(change => change.timestamp === latest)[0];
            return {
              ...ch.changes[0],
              cursorPosition: ch.cursorPosition, 
            }
          } else {
            const ch = group[1][0]; 
            return {
              ...ch.changes[0],
              cursorPosition: ch.cursorPosition,
            }
          }
        });
        return groups;
      } else {
        return changes[0].changes.map(change => { return {...change, cursorPosition: changes[0].cursorPosition}});
      }
    }
  }

  function moveTasks(direction, modifiedLineIndex, editorStructure, increment = 1) {
    const movedStructure = editorStructure
      .map(line => {
        const {startPos, endPos} = line;
        if(direction === 'down') {
          if(startPos.l >= modifiedLineIndex) {
            startPos.l += increment;
            endPos.l += increment;
          }
        } else if (direction === 'up') {
          if(startPos.l > modifiedLineIndex) {
            startPos.l -= increment;
            endPos.l -= increment;
          }
        }
        return {...line, startPos: startPos, endPos: endPos};
      });
    return movedStructure;
  } 

  function determineDeletedLineRange(change) {
    let startLine = Math.min(change.range.startLineNumber, change.range.endLineNumber);
    let endLine = Math.max(change.range.startLineNumber, change.range.endLineNumber);

    const deleteCursorLine = change.range.startColumn > 1 && change.range.endColumn === 1 || change.range.startColumn === 1 && change.range.endColumn > 1;
    const keepCursorLine = change.range.startColumn === 1 && change.range.endColumn === 1 || change.range.startColumn > 1 && change.range.endColumn > 1

    if(endLine - startLine === 1) {
      if(keepCursorLine && !deleteCursorLine) {
        if(change.cursorPosition.lineNumber === change.range.startLineNumber) {
          return [change.range.endLineNumber];
        } else {
          return [change.range.startLineNumber];
        }
      } else if(!keepCursorLine && deleteCursorLine) {
        return [change.range.startLineNumber, change.range.endLineNumber];
      }
    } else if(endLine - startLine > 1) {
      const length = endLine - startLine;
      if(keepCursorLine && !deleteCursorLine) {
        if(change.cursorPosition.lineNumber === change.range.startLineNumber) {
          startLine += 1;
        } else {
          endLine -= 1;
        }
        return Array.from({length: length}, (x, i) => i + startLine);
      } else if(!keepCursorLine && deleteCursorLine) {
        return Array.from({length: length}, (x, i) => i + startLine);
      }
    }
  }

  function determineDeletionDirection(change) {
    console.log("RECV", change);
    return change.cursorPosition.lineNumber === change.range.startLineNumber ? 'up' : 'down';
  }

  function handleCursorPosition(position, editor) {
    // console.log("CURSOR POSITION", position);
    // if (position.column < 6) {
    //   console.log("SMALLER -- ", position)
    //   editor.setPosition({lineNumber: position.lineNumber, column: 6});
    // }
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