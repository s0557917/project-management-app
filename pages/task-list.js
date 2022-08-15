import Navbar from "../components/general/navbar/Navbar"
import List from "../components/task-list/List"
import sampleData from "../data/sample-tasks"
import sampleCategories from "../data/sample-categories"
import { useState } from 'react'
import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue"
import AddTaskButton from "../components/task-editor-dialogue/AddTaskButton";

export default function TaskList() {

    const [opened, setOpened] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [sampleTasks, setSampleTasks] = useState(sampleData);

    //TODO DRY
    function onTaskSaved(taskData) {
        if (!taskData.id) {
            taskData.id = Math.random().toString(36).substr(2, 9);
            setSampleTasks([...sampleTasks, taskData]);

        } else {
            let taskIndex = sampleTasks.findIndex(task => task.id === taskData.id);
            let tasksCopy = [...sampleTasks];
            let modifiedTask = {
                ...tasksCopy[taskIndex],
                title: taskData.title,
                details: taskData.details,
                dueDate: taskData.dueDate,
                start: taskData.start,
                end: taskData.end,
                category: taskData.category,
                reminders: taskData.reminders,
                priority: taskData.priority,
            }

            tasksCopy[taskIndex] = modifiedTask;
            setSampleTasks(tasksCopy);
        }

        setOpened(false);
        setSelectedTask({});
    }

    function onCompletionStateChanged(taskId, isCompleted) {
        let modifiedTasks = [...sampleTasks];
        let modifiedTask = modifiedTasks.find(task => task.id === taskId);
        modifiedTask.completed = isCompleted;
        setSampleTasks(modifiedTasks);
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
                    tasks={sampleTasks} 
                    categories={sampleCategories}
                    selectedTaskSetter={setSelectedTask} 
                    modalStateSetter={setOpened}
                    onCompletionStateChanged={onCompletionStateChanged}
                />
                <TaskEditorDialogue 
                    tasks={sampleTasks} 
                    categories={sampleCategories}
                    modalState={[opened, setOpened]} 
                    selectedTaskState={selectedTask}
                    saveTaskCallback={onTaskSaved}
                    onModalClosed={onModalClosed}
                />
                <AddTaskButton modalStateSetter={setOpened}/>
            </div>
        </div>
    )
}