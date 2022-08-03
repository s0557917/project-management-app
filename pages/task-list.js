import ViewsTabs from "../components/general/ViewsTabs"
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

    function onTaskSaved(taskData) {
        console.log("SAVED: " + JSON.stringify(taskData));

        if (!taskData.id) {
            taskData.id = Math.random().toString(36).substr(2, 9);
            setSampleTasks([...sampleTasks, taskData]);

            console.log("sampleTasks: " + JSON.stringify(sampleTasks));

        } else {
            let taskIndex = sampleTasks.findIndex(task => task.id === taskData.id);
            let tasksCopy = [...sampleTasks];
            console.log("CATEGORY", taskData.category);
            let modifiedTask = {
                ...tasksCopy[taskIndex],
                title: taskData.title,
                details: taskData.details,
                dueDate: taskData.dueDate,
                timeRange: taskData.timeRange,
                category: taskData.category,
                reminders: taskData.reminders,
                priority: taskData.priority,
            }

            tasksCopy[taskIndex] = modifiedTask;
            setSampleTasks(tasksCopy);

            // setSampleTasks(({tasks}) => ({
            //     tasks: [
            //         ...tasks.slice(0, taskIndex),
            //         {
            //             ...tasks[taskIndex],
            //             id: taskData.id,
            //             title: taskData.title,
            //             details: taskData.details,
            //             dueDate: taskData.dueDate,
            //             timeRange: taskData.timeRange,
            //             category: taskData.category,
            //             reminders: taskData.reminders,
            //             priority: taskData.priority,
            //         },
            //         ...tasks.slice(taskIndex + 1),
            //     ]
            // }));
        }

        // setSampleTasks([...sampleTasks, taskData]);
        setOpened(false);
        setSelectedTask({});
    }

    function onModalClosed() {
        setSelectedTask({});
    }

    return (
        <>
            <ViewsTabs />        
            <h1 className="text-3xl font-bold underline">Task List</h1>
            <List 
                tasks={sampleTasks} 
                categories={sampleCategories}
                selectedTaskSetter={setSelectedTask} 
                modalStateSetter={setOpened}
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
        </>
    )
}