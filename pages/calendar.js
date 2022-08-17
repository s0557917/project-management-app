import Navbar from '../components/general/navbar/Navbar';
import { v4 as uuidv4 } from 'uuid';
import EventCalendar from "../components/calendar/EventCalendar"
import sampleData from "../data/sample-tasks";
import sampleCategories from "../data/sample-categories";
import { useState } from "react";
import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";

import prisma from "../utils/prisma";

export async function getServerSideProps() {
    const tasks = await prisma.task.findMany();
    const categories = await prisma.category.findMany();

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

    // function onTaskSaved(taskData) {
    //     if (!taskData.id) {
    //         taskData.id = uuidv4();
    //         const copy = [...sampleTasks, {...taskData, dueDate: taskData.dueDate.toString()}];
    //         setSampleTasks(copy);

    //     } else {
    //         let taskIndex = sampleTasks.findIndex(task => task.id === taskData.id);
    //         let tasksCopy = [...sampleTasks];
    //         let modifiedTask = {
    //             ...tasksCopy[taskIndex],
    //             title: taskData.title,
    //             details: taskData.details,
    //             dueDate: taskData.dueDate,
    //             start: taskData.start,
    //             end: taskData.end,
    //             category: taskData.categoryId,
    //             reminders: taskData.reminders,
    //             priority: taskData.priority,
    //         }

    //         tasksCopy[taskIndex] = modifiedTask;
    //         setSampleTasks(tasksCopy);
    //     }

    //     setOpened(false);
    //     setSelectedTask({});
    // }

    function onDateClicked(date){
        setSelectedDate(new Date(date));
        setOpened(true);
    }

    function onTaskClicked(task){
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
                <h1>Calendar</h1>

                <EventCalendar 
                    tasks={tasksState}
                    categories={categories}
                    dateClickCallback={onDateClicked}
                    taskClickCallback={onTaskClicked}
                    taskDroppedCallback={onTaskDropped}
                />

                <TaskEditorDialogue 
                    tasks={tasksState} 
                    categories={categories}
                    modalState={[opened, setOpened]} 
                    selectedTaskState={selectedTask}
                    saveEditedTaskCallback={onEditedTaskSaved}
                    saveNewTaskCallback={onNewTaskSaved}
                    onModalClosed={onModalClosed}
                    date={selectedDate}
                />
            </div>
        </div>
    )
}