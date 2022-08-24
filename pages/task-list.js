import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import AddTaskButton from "../components/general/buttons/AddTaskButton";
import Navbar from "../components/general/navbar/Navbar";
import List from "../components/task-list/List";
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSettings } from "../utils/db/queryFunctions/settings";
import { prismaGetAllTasks, getAllTasks, addNewTask, updateTask } from "../utils/db/queryFunctions/tasks";
import { getAllCategories, prismaGetAllCategories } from "../utils/db/queryFunctions/categories";
import { useMantineColorScheme } from '@mantine/core';
import TitleBar from "../components/general/layout/TitleBar";

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
  
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}

export default function TaskList() {
    const { colorScheme } = useMantineColorScheme();
    const queryClient = useQueryClient();

    const {data: userSettings, isFetching: isFetchingUserSettings} = useQuery(['settings'], getUserSettings);
    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);

    const newTaskMutation = useMutation(
        (newTask) => addNewTask(newTask),
        {
            onMutate: async (newTask) => {
                console.log("newTask", newTask);
            },
            onSuccess: async () => {
                queryClient.invalidateQueries('tasks');
            },
            onSettled: async (data, error, variables, context) => {
                console.log("settled", data, error, variables, context);
            }
        }
    );

    const updateTaskMutation = useMutation(
        (updatedTask) => updateTask(updatedTask),
        {onSuccess: async () => {
            queryClient.invalidateQueries('tasks');
        }}
    )

    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});

    async function onNewTaskSaved(taskData) {
        newTaskMutation.mutate(taskData);

        setOpenedTaskEditor(false);
        setSelectedTask({});
    }

    async function onEditedTaskSaved(taskData, taskId){
        const modifiedTask = {...taskData, id: taskId};
        updateTaskMutation.mutate(modifiedTask);
            
        setOpenedTaskEditor(false);
        setSelectedTask({});
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