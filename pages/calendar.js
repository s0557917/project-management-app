import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import EventCalendar from "../components/calendar/EventCalendar"
import Navbar from '../components/general/navbar/Navbar';
import { getSession } from 'next-auth/react';
import { useState, useEffect } from "react";
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTasks, addNewTask, updateTask } from "../utils/db/queryFunctions/tasks";
import { getAllCategories } from "../utils/db/queryFunctions/categories";
import { getTheme } from "../utils/db/queryFunctions/settings";
import { prismaGetAllTasks } from "../utils/db/prismaQueryFunctions/tasks";
import { prismaGetAllCategories } from "../utils/db/prismaQueryFunctions/categories";
import { prismaGetTheme } from "../utils/db/prismaQueryFunctions/theme";
import TitleBar from "../components/general/layout/TitleBar";
import { useMantineColorScheme } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";

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

export default function Calendar() {

    const queryClient = useQueryClient();

    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);
    const { data: prefetchedTheme, isFetching: isFetchingTheme } = useQuery(['theme'], getTheme); 

    const { toggleColorScheme } = useMantineColorScheme();
    
    useEffect(() => {
        toggleColorScheme(prefetchedTheme);
    }, [isFetchingTheme]);

    const [selectedTask, setSelectedTask] = useState({});
    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

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
            }
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

    function onDateClicked(date){
        setSelectedDate(new Date(date));
        setOpenedTaskEditor(true);
    }

    function onTaskClicked(task){
        setSelectedTask(task);
        setOpenedTaskEditor(true);
    }

    async function onTaskDropped(modifiedDroppedTask){
        updateTaskMutation.mutate(modifiedDroppedTask);
    }

    function onModalClosed() {
        setSelectedTask({});
    }

    return (
        <div>
            <Navbar />
            <div className="h-screen p-5">
                <TitleBar 
                    width={'w-full'}
                    displaySortingMenu={false}
                />

                <EventCalendar 
                    tasks={tasks}
                    categories={categories}
                    dateClickCallback={onDateClicked}
                    taskClickCallback={onTaskClicked}
                    taskDroppedCallback={onTaskDropped}
                    isFetchingTasks={isFetchingTasks}
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
                    date={selectedDate}
                />
            </div>
        </div>
    )
}