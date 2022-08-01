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
        setSampleTasks([...sampleTasks, taskData]);
        setOpened(false);
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
                modalState={[opened, setOpened]} 
                selectedTaskState={[selectedTask, setSelectedTask]} 
                saveTaskCallback={onTaskSaved}
            />
            <AddTaskButton modalStateSetter={setOpened}/>
        </>
    )
}