import Navbar from "../components/general/navbar/Navbar";
import List from "../components/task-list/List";
import sampleData from "../data/sample-tasks";
import sampleCategories from "../data/sample-categories";
import { useState } from 'react';
import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import AddTaskButton from "../components/task-editor-dialogue/AddTaskButton";
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

export default function TaskList({tasks, categories}) {

    const [opened, setOpened] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [tasksState, setTasksState] = useState(tasks);
    const [categoriesState, setCategoriesState] = useState(categories);

    async function onNewTaskSaved(taskData) {
        console.log("TASK DATA: ", taskData);

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

    async function onCompletionStateChanged(taskId, isCompleted) {    
        const modifiedTasks = [...tasksState];
        const taskIndex = tasksState.findIndex(task => task.id === taskId);
        modifiedTasks[taskIndex].completed = isCompleted;
        setTasksState(modifiedTasks);

        await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedTasks[taskIndex]),
        })
        .then((response) => response.json())
        .then((data) => {
            const taskIndex = tasksState.findIndex(task => task.id === data.id);
            const tasksCopy = [...tasksState];
            modifiedTasks[taskIndex] = data;
            
            setTasksState(tasksCopy);
        });
    }

    function onModalClosed() {
        setSelectedTask({});
    }

    return (
        <div className="h-screen">
            <Navbar /> 
            <div className="h-full p-5">       
                <h1 className="text-3xl font-bold underline">Task List</h1>
                <List 
                    tasks={tasksState} 
                    categories={categoriesState}
                    selectedTaskSetter={setSelectedTask} 
                    modalStateSetter={setOpened}
                    onCompletionStateChanged={onCompletionStateChanged}
                />
                <TaskEditorDialogue 
                    tasks={tasksState} 
                    categories={categoriesState}
                    modalState={[opened, setOpened]} 
                    selectedTaskState={selectedTask}
                    saveEditedTaskCallback={onEditedTaskSaved}
                    saveNewTaskCallback={onNewTaskSaved}
                    onModalClosed={onModalClosed}
                />
                <AddTaskButton modalStateSetter={setOpened}/>
            </div>
        </div>
    )
}