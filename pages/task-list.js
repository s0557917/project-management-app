import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import AddTaskButton from "../components/general/buttons/AddTaskButton";
import Navbar from "../components/general/navbar/Navbar";
import List from "../components/task-list/List";
import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSettings, prismaGetTheme, getTheme } from "../utils/db/queryFunctions/settings";
import { prismaGetAllTasks, getAllTasks, addNewTask, updateTask } from "../utils/db/queryFunctions/tasks";
import { getAllCategories, prismaGetAllCategories } from "../utils/db/queryFunctions/categories";
import TitleBar from "../components/general/layout/TitleBar";
import { useMantineColorScheme } from "@mantine/core";
import { showNotification } from '@mantine/notifications';

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
    await queryClient.prefetchQuery(['theme'], prismaGetTheme(session.user.email));
  
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}

export default function TaskList() {
    const queryClient = useQueryClient();

    const {data: userSettings, isFetching: isFetchingUserSettings} = useQuery(['settings'], getUserSettings);
    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);
    const { data: prefetchedTheme, isFetching: isFetchingTheme } = useQuery(['theme'], getTheme); 

    const { toggleColorScheme } = useMantineColorScheme();
    
    useEffect(() => {
        toggleColorScheme(prefetchedTheme);
    }, [isFetchingTheme]);

    const newTaskMutation = useMutation(
        (newTask) => addNewTask(newTask),
        {
            onSuccess: async () => {
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
        {onSuccess: async () => {
            queryClient.invalidateQueries('tasks');
            showNotification({
                autoClose: 3000,
                type: 'success',
                color: 'green',
                title: 'Task updated successfully!',
            });
        }}
    )

    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});

    async function onNewTaskSaved(taskData) {
        if(taskData.title != '') {
            newTaskMutation.mutate(taskData);
            setOpenedTaskEditor(false);
            setSelectedTask({});
        } else {
            showNotification({
                autoClose: 3000,
                type: 'error',
                color: 'red',
                title: 'Error saving your task!',
                message: 'Please ensure that your task has a title!'
            });
        }
    }

    async function onEditedTaskSaved(taskData, taskId){
        if(taskData.title != '') {
            const modifiedTask = {...taskData, id: taskId};
            updateTaskMutation.mutate(modifiedTask);
                
            setOpenedTaskEditor(false);
            setSelectedTask({});
        } else {
            showNotification({
                autoClose: 3000,
                type: 'error',
                color: 'red',
                title: 'Error saving your task!',
                message: 'Please ensure that your task has a title!'
            });
        }
    }

    async function onCompletionStateChanged(taskId, isCompleted) {    
        const modifiedTask = {...tasks.find(task => task.id === taskId), completed: isCompleted};
        updateTaskMutation.mutate(modifiedTask);
    }

    function onModalClosed() {
        setSelectedTask({});
    }

    return (
        <div className={`relative w-screen h-screen flex flex-col flex-1 scroll overflow-scroll `}>
            <Navbar /> 
            <div className="h-full p-5">       
                <TitleBar 
                    width={'w-4/5'}
                    displaySortingMenu={true}
                />
                <List 
                    tasks={tasks} 
                    categories={categories}
                    selectedTaskSetter={setSelectedTask} 
                    modalStateSetter={setOpenedTaskEditor}
                    onCompletionStateChanged={onCompletionStateChanged}
                    userSettings={userSettings}
                    isFetchingUserSettings={isFetchingUserSettings}
                    isFetchingCategories={isFetchingCategories}
                />
                <TaskEditorDialogue 
                    tasks={tasks} 
                    categories={categories}
                    modalState={[openedTaskEditor, setOpenedTaskEditor]} 
                    selectedTask={selectedTask}
                    selectedTaskSetter={setSelectedTask}
                    saveEditedTaskCallback={onEditedTaskSaved}
                    saveNewTaskCallback={onNewTaskSaved}
                    onModalClosed={onModalClosed}
                />
                <AddTaskButton modalStateSetter={setOpenedTaskEditor}/>
            </div>
        </div>
    )
}