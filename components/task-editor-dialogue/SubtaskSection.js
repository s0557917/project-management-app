import { Title } from "@mantine/core"
import SubtaskDialogue from "./SubtaskDialogue"
import Sublist from "../task-list/Sublist"
import { useState } from "react";

export default function SubtaskSection({ tasks, categories, selectedTask, subtasksState }) {
    
    const [subtasks, setSubtasks] = subtasksState;

    function onSubtaskClicked(subtask){
        console.log("SUBTASK CLICKED", subtask); 
    }

    async function onDialogueSubtaskClicked(subtask){
        setSubtasks([...subtasks, subtask]);
    }

    function onDialogueSubtaskAdded(title){
        // async function onNewTaskSaved(taskData) {
        //     await fetch('/api/tasks', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(taskData),
        //     })
        //         .then((response) => response.json())
        //         .then((data) => setTasksState([...tasksState, data]));
    
        //     setOpenedTaskEditor(false);
        //     setSelectedTask({});
        // }
        console.log("New Title", title);
    }

    return (
        <div className='bg-zinc-800 rounded-lg p-3 my-3'>
            <div className='flex justify-between mb-2 items-center'>
                <Title order={4}>Subtasks</Title>
                <SubtaskDialogue 
                    tasks={tasks?.filter((task) => task.id !== selectedTask.id && !subtasks?.includes(task.id))} 
                    categories={categories} 
                    selectedTask={selectedTask}
                    onSubtaskClicked={onDialogueSubtaskClicked}
                    onSubtaskAdded={onDialogueSubtaskAdded}
                />
            </div>
                <Sublist 
                    tasks={tasks?.filter((task) => subtasks?.includes(task.id))}
                    categories={categories}
                    onSubtaskClicked={onSubtaskClicked}
                />
        </div>
    )
}