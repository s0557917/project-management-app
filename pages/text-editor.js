import Navbar from "../components/general/navbar/Navbar"
import { useEffect, useRef } from 'react';
import { useMonaco } from "@monaco-editor/react";
import dynamic from 'next/dynamic';
import { options } from '../editor/editorConfig';
import useDebounce from '../utils/hooks/useDebounce';
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTasks, deleteTask, updateTask } from '../utils/db/queryFunctions/tasks';
import { getAllCategories } from '../utils/db/queryFunctions/categories';
import { getTextEditorStructure, updateTextEditorStructure } from "../utils/db/queryFunctions/textEditorStructure";
import { getTheme } from "../utils/db/queryFunctions/settings";
import { prismaGetAllTasks } from "../utils/db/prismaQueryFunctions/tasks";
import { prismaGetAllCategories } from "../utils/db/prismaQueryFunctions/categories";
import { prismaGetTheme } from "../utils/db/prismaQueryFunctions/theme";
import { prismaGetTextEditorStructure } from "../utils/db/prismaQueryFunctions/textEditorStructure";
import { getSession } from 'next-auth/react';
import TextEditorSkeleton from '../components/general/loading/TextEditorSkeleton';
import textEditorSetup from '../utils/text-editor/textEditorSetup';
import { mapSingleTask, mapTaskStructureToEditor } from '../utils/text-editor/taskMapping';
import { useState } from 'react';
import { runSyntaxCheck, splitContentIntoLines, getTaskComponents, structureEditorContent, mapLineToTask, displayCompletedTasks, areLinesEqual } from '../utils/text-editor/textProcessing';
import { addNewTask } from "../utils/db/queryFunctions/tasks";
import ErrorInformation from "../components/text-editor/information/ErrorInformation";
import UsageInformation from "../components/text-editor/information/UsageInformation";
import { useMantineColorScheme } from "@mantine/core";
import { v4 as uuidv4 } from 'uuid';
import Loading from "../components/general/loading/Loading";
import StatusInformation from "../components/text-editor/information/StatusInformation";

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

  const {data: tasks} = useQuery(['tasks'], getAllTasks);
  const {data: categories} = useQuery(['categories'], getAllCategories);
  const {data: textEditorStructure} = useQuery(['textEditorStructure'], getTextEditorStructure);
  const { data: prefetchedTheme, isFetching: isFetchingTheme } = useQuery(['theme'], getTheme); 

  const { toggleColorScheme } = useMantineColorScheme();
  
  const [editorContentStructure, setEditorContentStructure] = useState([]);

  const [unManagedContent, setUnManagedContent] = useState('');
  const [status, setStatus] = useState('loading');
  const [editorContent, setEditorContent] = useState(() => handleInitialContentSetup() || '');
  const [canUpdate, setCanUpdate] = useState(true);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [textDecorations, setTextDecorations] = useState([]);
  const debouncedEditorContent = useDebounce(unManagedContent, 1000);
  const [editorChanges, setEditorChanges] = useState([]);	
  
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
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const updateTextEditorStructureMutation = useMutation(
    (updatedTextEditorStructure) => updateTextEditorStructure({structure: updatedTextEditorStructure, action: 'update'}),
    {
      onSuccess: async (data) => {
        // setEditorContent(mapTaskStructureToEditor(data.textEditorStructure, tasks, categories));
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
      setUnManagedContent(editor.getValue());
      setStatus('loading');
      const changeObject = {changes: e.changes, timestamp: Date.now(), cursorPosition: editor.getPosition()};
      setEditorChanges(prevEditorChanges => [...prevEditorChanges, changeObject]);
    });
    editor.onDidChangeCursorSelection(e => {
      setUnManagedContent(editor.getValue());
      setStatus('loading');
    });
    editor.onDidChangeCursorPosition(e => {
      setUnManagedContent(editor.getValue());
      setStatus('loading');
    });
    setUnManagedContent(editor.getValue());
    setStatus('loading');
    editorRef.current = editor; 

    editor.addAction({
      id: 'supress-undo',
      label: 'Supress Undo',
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ
        )
      ],
      precondition: null,
      keybindingContext: null,
      run: () => {}
    })

    editor.addAction({
      id: 'supress-redo',
      label: 'Supress Redo',
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY
        )
      ],
      precondition: null,
      keybindingContext: null,
      run: () => {}
    })

    setStatus('ready');
  }

  useEffect(() => {
    toggleColorScheme(prefetchedTheme);
  }, [isFetchingTheme]);

  useEffect(() => {
    if(categories !== undefined && categories !== null && categories.length > 0) {
      textEditorSetup(monaco, categories);
    }
  }, []);

  useEffect(() => {
    if(textEditorStructure) {
      const editorContent = handleInitialContentSetup();
      setEditorContent(editorContent);
      
      if(editorContent && editorContent !== '' && editorContent !== [] && editorContent.length > 0  ) {
        const {isSyntaxValid, errors} = runSyntaxCheck(editorContent, categories);
        console.log("Text editor structure updated");
        setSyntaxErrors(errors);
        setCanUpdate(isSyntaxValid); 
      }  
    }
  }, [textEditorStructure]);

  useEffect(() => { 
    if(unManagedContent !== '') {
      const {isSyntaxValid, errors} = runSyntaxCheck(unManagedContent, categories);
      setSyntaxErrors(errors);
      setCanUpdate(isSyntaxValid);
      
      const editorLines = splitContentIntoLines(debouncedEditorContent);
      if(editorRef !== null && editorRef.current !== null) {
        const decorations = displayCompletedTasks(editorLines, textDecorations, editorRef);
        setTextDecorations(decorations);
      }
      if(isSyntaxValid) {
        findChanges();
      }
    }
    
    setStatus('ready');
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
    let deletedTasks = [];
    const newTasks = [];
    const modifiedTasks = [];
    
    let modifiedStructure = editorContentStructure; 

    if(editorChanges && editorChanges.length > 0) {

      const oldEditorLines = splitContentIntoLines(editorContent);
      const newEditorLines = splitContentIntoLines(unManagedContent);


      const swaps = editorChanges.filter(change => change.changes.length == 2).sort((a, b) => a.timestamp - b.timestamp);
      const uniqueChanges = getUniqueLineChanges(editorChanges.sort((a, b) => a.timestamp - b.timestamp).filter(change => change.changes.length === 1));
      
      if(uniqueChanges && uniqueChanges.length > 0) {
        uniqueChanges.forEach(change => {
          const modifiedTask = editorContentStructure?.find(line => {
            return line.startPos.l === change.range.startLineNumber;
          });

          if(oldEditorLines.length < newEditorLines.length) {
            //NEW TASK
            // console.log("--------------------------------------")
            // console.log("New task detected", change);
            const newTaskId = uuidv4();
            // console.log("NEW EDITOR LINES", newEditorLines)
            const position = {
              startPos: {l: change.range.startLineNumber, c: 1},
              endPos: {l: change.range.startLineNumber, c: newEditorLines[change.range.startLineNumber - 1].length},
            };
            // console.log("POSITION", position);
            newTasks.push({position: position, taskId: newTaskId, components: getTaskComponents(newEditorLines[change.range.startLineNumber - 1])});
            if(change.range.startLineNumber !== newEditorLines.length) {
              modifiedStructure = moveTasks('down', change.range.startLineNumber, modifiedStructure);
            }
            
            modifiedStructure.push({ 
              id: newTaskId,
              startPos: position.startPos,
              endPos: position.endPos, 
              components: getTaskComponents(newEditorLines[change.range.startLineNumber - 1])
            });
            // console.log("--------------------------------------")
          } else if(modifiedTask) {
            if(oldEditorLines.length > newEditorLines.length && change.text === '' && change.range.startLineNumber !== change.range.endLineNumber) {
              
              const startLine = change.range.startLineNumber;
              const endLine = change.range.endLineNumber;
              const startColumn = change.range.startColumn;
              const endColumn = change.range.endColumn;
              const startLineWidth = oldEditorLines[startLine - 1].length;

              //DELETED TASKS
              if(startColumn > 1 && startColumn < startLineWidth) {
                const { areEqual, components } = areLinesEqual(oldEditorLines[startLine - 1], newEditorLines[startLine - 1]);
                if(modifiedTask.id && !areEqual) {
                  modifiedTasks.push({id: modifiedTask.id, components: components});
                }
                const deletedLineRange = Array.from({length: endLine - startLine}, (x, i) => i + startLine + 1);
                deletedTasks = modifiedStructure.filter(line => deletedLineRange.includes(line.startPos.l)).map(line => line.id);
                modifiedStructure = modifiedStructure.filter(line => !deletedLineRange.includes(line.startPos.l));
                modifiedStructure = moveTasks('down', startLine + 1, modifiedStructure, endLine - startLine);

              } else if(startColumn === 1 && endColumn === 1) {
              
                //MULTIPLE LINES; LAST LINE NOT INCLUDED -- console.log("DELETE LINES ", startLine, " to " , endLine - 1, "AND MOVE UP FROM LINE ", startLine, " by ", endLine - startLine);
                const deletedLineRange = Array.from({length: endLine - startLine}, (x, i) => i + startLine);
                deletedTasks = modifiedStructure.filter(line => deletedLineRange.includes(line.startPos.l)).map(line => line.id);
                modifiedStructure = modifiedStructure.filter(line => !deletedLineRange.includes(line.startPos.l));
                modifiedStructure = moveTasks('down', startLine, modifiedStructure, endLine - startLine);
              
              } else if(startColumn > 1 && endColumn > 1) {
                //MULTIPLE LINES; FIRST LINE NOT INCLUDED -- console.log("DELETE LINES ", startLine + 1, " to ", endLine, "AND MOVE UP FROM LINE ", startLine + 1, " by ", endLine - startLine);
                const deletedLineRange = Array.from({length: endLine - startLine}, (x, i) => i + (startLine + 1))
                deletedTasks = modifiedStructure.filter(line => deletedLineRange.includes(line.startPos.l)).map(line => line.id);
                modifiedStructure = modifiedStructure.filter(line => !deletedLineRange.includes(line.startPos.l));
                modifiedStructure = moveTasks('down', startLine + 1, modifiedStructure, endLine - startLine);

              } else if (startColumn !== endColumn) {
                //ALL LINES -- console.log("DELETE LINES ", startLine + 1, " to ", endLine, "AND MOVE UP FROM LINE ", startLine + 1, " by ", endLine - startLine);
                const deletedLineRange = Array.from({length: endLine - startLine}, (x, i) => i + (startLine + 1))
                deletedTasks = modifiedStructure.filter(line => deletedLineRange.includes(line.startPos.l)).map(line => line.id);
                modifiedStructure = modifiedStructure.filter(line => !deletedLineRange.includes(line.startPos.l));
                modifiedStructure = moveTasks('down', startLine + 1, modifiedStructure, endLine - startLine);
              }
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
        });
      }

      deletedTasks.forEach(taskId => {
        deleteTaskMutation.mutate(taskId)
      });

      newTaskMutation.mutate(newTasks.map(task => {
        return {
          id: task.taskId,
          title: task.components.title,
          details: task.components.details || '',
          categoryId: categories?.find(category => category.name === task.components.category)?.id || '',
          dueDate: new Date(task.components.dueDate) || null,
          priority: task.components.priority || 1,
          completed: task.components.completed || false,
          start: new Date(task.components.start) || null,
          end: new Date(task.components.end) || null,
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
              return category?.name?.trim() === task.components?.category?.trim()
            })?.id || '',
          dueDate: new Date(task.components.dueDate) || null,
          priority: task.components.priority || 1,
          completed: task.components.isCompleted || false,
          start: new Date(task.components.start) || null,
          end: new Date(task.components.end) || null,
          reminders: null,
          subtasks: null,
        }

        updateTaskMutation.mutate(updatedTask);
      });

      setEditorContentStructure(modifiedStructure);
      setEditorChanges([]);
      setEditorContent(unManagedContent);
      setStatus('ready');
      console.log("MODIFIED STRUCTURE", modifiedStructure);
      updateTextEditorStructureMutation.mutate(modifiedStructure);
    }
  }

  function getUniqueLineChanges(changes) {
    if(changes) {
      if(changes.length > 1 ) {

        if(changes.length === 2 
          && changes[0].changes[0].text === '' 
          && changes[1].changes[0].text === '' 
          && changes[0].changes[0].range.startLineNumber !== changes[0].changes[0].range.endLineNumber
          && changes[1].changes[0].range.startLineNumber !== changes[1].changes[0].range.endLineNumber
        ) {
          let changedObject = []; 
          const sortedChanges = changes.sort((a,b) => a.timestamp - b.timestamp);
          changedObject[0] = {...sortedChanges[1]};
          const startLine = Math.min(changes[0].changes[0].range.startLineNumber, changes[1].changes[0].range.startLineNumber);
          const endLine = Math.max(changes[0].changes[0].range.endLineNumber, changes[1].changes[0].range.endLineNumber);
          changedObject[0].changes[0].range.startLineNumber = startLine;
          changedObject[0].changes[0].range.endLineNumber = endLine; 
          changedObject[0].cursorPosition.lineNumber = Math.max(changes[0].cursorPosition.lineNumber, changes[1].cursorPosition.lineNumber); 
          
          return [{...changedObject[0].changes[0], cursorPosition: changedObject[0].cursorPosition}];
        
        } else if(changes[0].changes[0].text === '\n' ) {
          return changes[1].changes.map(change => { return {...change, cursorPosition: changes[1].cursorPosition}})
        } else {
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
        }
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

  return (  
    <>
      {
        <div>
          <Loading />
          <Navbar />
          <div className="flex items-center w-full justify-end px-5">
              {!canUpdate && 
                <ErrorInformation 
                errors={syntaxErrors}
                />
              }
              {/* <StatusInformation status={status} /> */}
              <UsageInformation />
          </div>
          <div className='px-5 pt-2'>
            {!tasks 
              || tasks === null 
              || !categories 
              || categories === null 
              || !options 
              || options === null 
              || !textEditorStructure 
              || textEditorStructure === null
            ? <TextEditorSkeleton />
            : <MonacoEditor
                height="80vh"
                language='taskLanguage'
                options={options}
                theme="sampleTheme"
                value={editorContent}
                onMount={handleEditorDidMount}
              />
            }
          </div>
        </div>
      }
    </>
  )
}