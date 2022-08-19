import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import AddTaskButton from "../components/task-editor-dialogue/AddTaskButton";
import Navbar from "../components/general/navbar/Navbar";
import List from "../components/task-list/List";
import { getSession } from 'next-auth/react';
import { Select } from '@mantine/core';
import prisma from "../utils/prisma";
import { useState } from 'react';

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

export default function TaskList({tasks, categories}) {

    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [openedCategoryEditor, setOpenedCategoryEditor] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [tasksState, setTasksState] = useState(tasks);
    const [categoriesState, setCategoriesState] = useState(categories);

    async function onNewTaskSaved(taskData) {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        })
            .then((response) => response.json())
            .then((data) => setTasksState([...tasksState, data]));

        setOpenedTaskEditor(false);
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
            
        setOpenedTaskEditor(false);
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
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold underline">Task List</h1>
                    <div>
                        <button className="left-" onClick={() => setOpenedCategoryEditor(true)}>Categories</button>
                        {openedCategoryEditor && <Select
                            label="Categories"
                            placeholder="Select items"
                            nothingFound="Nothing found"
                            data={ categories?.map(category =>(
                                    { 
                                        value: category.id, 
                                        label: category.name
                                    }
                                ))
                            }
                            searchable
                            creatable
                            getCreateLabel={(query) => `+ Create ${query}`}
                            onCreate={(query) => {
                                // const item = { value: query, label: query };
                                console.log("ITEM: ", query);
                                // setData((current) => [...current, item]);
                                // return item;
                            }}
                        />}
                    </div>
                </div>
                <List 
                    tasks={tasksState} 
                    categories={categoriesState}
                    selectedTaskSetter={setSelectedTask} 
                    modalStateSetter={setOpenedTaskEditor}
                    onCompletionStateChanged={onCompletionStateChanged}
                />
                <TaskEditorDialogue 
                    tasks={tasksState} 
                    categories={categoriesState}
                    modalState={[openedTaskEditor, setOpenedTaskEditor]} 
                    selectedTaskState={selectedTask}
                    saveEditedTaskCallback={onEditedTaskSaved}
                    saveNewTaskCallback={onNewTaskSaved}
                    onModalClosed={onModalClosed}
                />
                <AddTaskButton modalStateSetter={setOpenedTaskEditor}/>
            </div>
        </div>
    )
}