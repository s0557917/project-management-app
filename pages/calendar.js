import FilteringMenu from "../components/task-list/filtering-and-sorting/FilteringMenu";
import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import SortingMenu from "../components/task-list/filtering-and-sorting/SortingMenu";
import EventCalendar from "../components/calendar/EventCalendar"
import Navbar from '../components/general/navbar/Navbar';
import { getSession } from 'next-auth/react';
import prisma from "../utils/prisma";
import { useState } from "react";

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
  
    const tasks = await prisma.task.findMany({
        where: {
            owner: { email: session.user.email },
        },
    });
    const categories = await prisma.category.findMany({
        where: {
            owner: { email: session.user.email },
        },
    });

    return {
        props: {
            tasks: JSON.parse(JSON.stringify(tasks)),
            categories: JSON.parse(JSON.stringify(categories))
        },
    }
}

export default function Calendar({tasks, categories}) {

    const [tasksState, setTasksState] = useState(tasks);
    const [categoriesState, setCategoriesState] = useState(categories);
    const [selectedTask, setSelectedTask] = useState({});
    const [opened, setOpened] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');

    const [activeCategories, setActiveCategories] = useState(
        categories.map(category => { 
            return {
                id: category.id, 
                active: category.active
            }
        })
    );
    const [displaySettings, setDisplaySettings] = useState([
        {
            setting: "displayUncategorized",
            label: "Uncategorized",
            value: false
        }
    ]);

    async function onNewTaskSaved(taskData) {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        })
            .then((response) => response.json())
            .then((data) => setTasksState([...tasksState, data]));

        setOpened(false);
        setSelectedTask({});
    }

    async function onEditedTaskSaved(taskData, taskId){
        await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        })
            .then((response) => response.json())
            .then((data) => {
                const taskIndex = tasksState.findIndex(task => task.id === data.id);
                const tasksCopy = [...tasksState];
                tasksCopy[taskIndex] = data;
                
                setTasksState(tasksCopy);
            });
            
        setOpened(false);
        setSelectedTask({});
    }

    function onDateClicked(date){
        setSelectedDate(new Date(date));
        setOpened(true);
    }

    function onTaskClicked(task){
        console.log("TASK CLICKED: ", task);
        setSelectedTask(task);
        setOpened(true);
    }

    async function onTaskDropped(modifiedDroppedTask){
        await fetch(`/api/tasks/${modifiedDroppedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedDroppedTask),
        })
        .then((response) => response.json())
        .then((data) => {
            const taskIndex = tasksState.findIndex(task => task.id === data.id);
            const tasksCopy = [...tasksState];
            tasksCopy[taskIndex] = data;
            
            setTasksState(tasksCopy);
        });
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
                            activeCategoriesState={[activeCategories, setActiveCategories]}
                            displaySettingsState={[displaySettings, setDisplaySettings]}
                        />
                    </div>
                </div>

                <EventCalendar 
                    tasks={tasksState}
                    categories={categories}
                    dateClickCallback={onDateClicked}
                    taskClickCallback={onTaskClicked}
                    taskDroppedCallback={onTaskDropped}
                    activeCategories={activeCategories}
                    displaySettings={displaySettings}
                />

                <TaskEditorDialogue 
                    tasks={tasksState} 
                    categories={categories}
                    modalState={[opened, setOpened]} 
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