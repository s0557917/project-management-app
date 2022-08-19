import { Title } from "@mantine/core"
import SubtaskDialogue from "./SubtaskDialogue"
import Sublist from "../task-list/Sublist"
import { useState } from "react";

export default function SubtaskSection({ tasks, categories, selectedTask, subtasksState }) {
    
    const [subtasks, setSubtasks] = subtasksState;

    function onSubtaskClicked(subtaskId){
        console.log("SUBTASK CLICKED", subtaskId); 
    }

    function onSubtaskRemoved(subtaskId){
        const filteredSubtasks = subtasks.filter(subtask => subtask !== subtaskId);
        setSubtasks(filteredSubtasks);
    }

    async function onDialogueSubtaskClicked(subtask){
        setSubtasks([...subtasks, subtask]);
    }

    function onDialogueSubtaskAdded(title){

    }

    return (
        <div className='bg-zinc-800 rounded-lg p-3 my-3'>
            <div className='flex items-center justify-between mb-2'>
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
                    onSubtaskRemoved={onSubtaskRemoved}
                />
        </div>
    )
}