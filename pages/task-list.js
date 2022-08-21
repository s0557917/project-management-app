import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";
import AddTaskButton from "../components/task-editor-dialogue/AddTaskButton";
import Navbar from "../components/general/navbar/Navbar";
import List from "../components/task-list/List";
import { getSession } from 'next-auth/react';
import prisma from "../utils/prisma";
import { useState } from 'react';
import SortingMenu from "../components/task-list/filtering-and-sorting/SortingMenu";
import FilteringMenu from "../components/task-list/filtering-and-sorting/FilteringMenu";
import TextEditorSplitScreen from "../components/text-editor/TextEditorSplitScreen";

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
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    return {
        props: {
            tasks: JSON.parse(JSON.stringify(tasks)),
            categories: JSON.parse(JSON.stringify(categories)),
            user: JSON.parse(JSON.stringify(user))
        },
    }
}

export default function TaskList({tasks, categories, user}) {

    const [splitScreenOpen, setSplitScreenOpen] = useState(false);
    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [openedCategoryEditor, setOpenedCategoryEditor] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [tasksState, setTasksState] = useState(tasks);
    const [categoriesState, setCategoriesState] = useState(categories);
    const [sortingMethod, setSortingMethod] = useState("category");
    const [activeCategories, setActiveCategories] = useState(
        categories.map(category => { 
            return {
                id: category.id, 
                active: category.active
            }
        })
    );
    const [displaySettings, setDisplaySettings] = useState(user.settings.filters);

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
        <div className="h-screen flex flex-col flex-1 bg-green-500">
            <Navbar /> 
            <div className="h-full p-5">       
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold underline">Task List</h1>
                    <div className="mx-5">
                        <SortingMenu 
                            sortingMethodSetter={setSortingMethod}
                        />
                        <FilteringMenu 
                            categories={categories}
                            activeCategoriesState={[activeCategories, setActiveCategories]}
                            displaySettingsState={[displaySettings, setDisplaySettings]}
                            user={user}
                        />
                    </div>
                </div>
                <List 
                    tasks={tasksState} 
                    categories={categoriesState}
                    activeCategories={activeCategories}
                    selectedTaskSetter={setSelectedTask} 
                    modalStateSetter={setOpenedTaskEditor}
                    onCompletionStateChanged={onCompletionStateChanged}
                    sortingMethod={sortingMethod}
                    displaySettings={displaySettings}
                />
                <TaskEditorDialogue 
                    tasks={tasksState} 
                    categories={categoriesState}
                    modalState={[openedTaskEditor, setOpenedTaskEditor]} 
                    selectedTask={selectedTask}
                    selectedTaskSetter={setSelectedTask}
                    saveEditedTaskCallback={onEditedTaskSaved}
                    saveNewTaskCallback={onNewTaskSaved}
                    onModalClosed={onModalClosed}
                />
                <AddTaskButton modalStateSetter={setOpenedTaskEditor}/>
            </div>
            <div className="">
                {splitScreenOpen 
                    ? <TextEditorSplitScreen className="flex-1"/> 
                    : <button 
                        className="fixed right-2/4 bottom-5 hover:bg-cyan-700 bg-cyan-500 rounded-lg p-4"
                        onClick={() => setSplitScreenOpen(true)}
                        >Test</button>}
            </div>
        </div>
    )
}