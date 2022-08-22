import FilteringMenu from "../components/general/menus/filtering-and-sorting/FilteringMenu";
import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import SortingMenu from "../components/general/menus/filtering-and-sorting/SortingMenu";
import EventCalendar from "../components/calendar/EventCalendar"
import Navbar from '../components/general/navbar/Navbar';
import { getSession } from 'next-auth/react';
import { useState } from "react";
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSettings } from "../utils/db/queryFunctions/settings";
import { prismaGetAllTasks, getAllTasks, addNewTask, updateTask } from "../utils/db/queryFunctions/tasks";
import { getAllCategories, prismaGetAllCategories } from "../utils/db/queryFunctions/categories";
import prisma from "../utils/prisma";

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

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            user: JSON.parse(JSON.stringify(user)),
        },
    }
}

export default function Calendar({user}) {

    const queryClient = useQueryClient();

    const {data: userSettings, isFetching: isFetchingUserSettings} = useQuery(['settings'], getUserSettings);
    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);

    const [selectedTask, setSelectedTask] = useState({});
    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

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
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold underline">Calendar</h1>
                    <div className="mx-5">
                        <FilteringMenu 
                            categories={categories}
                            userSettings={userSettings}
                            user={user}
                        />
                    </div>
                </div>

                <EventCalendar 
                    tasks={tasks}
                    categories={categories}
                    dateClickCallback={onDateClicked}
                    taskClickCallback={onTaskClicked}
                    taskDroppedCallback={onTaskDropped}
                    userSettings={userSettings}
                    isFetchingUserSettings={isFetchingUserSettings}
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