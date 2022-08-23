import { Title } from "@mantine/core"
import SubtaskDialogue from "../sub-menus/SubtaskDialogue"
import Sublist from "./Sublist"
import { useState } from "react";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function SubtaskSection({ tasks, categories, selectedTask, subtasksState }) {

    const [subtasks, setSubtasks] = subtasksState;
    const [newTasks, setNewTasks] = useState([]);

    function onSubtaskClicked(subtaskId){
         
    }

    function onSubtaskRemoved(subtaskId){
        const filteredSubtasks = subtasks.filter(subtask => subtask !== subtaskId);
        setSubtasks(filteredSubtasks);
    }

    async function onDialogueSubtaskClicked(subtask){
        if(subtasks !== undefined) {
            setSubtasks([...subtasks, subtask]);
        } else {
            setSubtasks([subtask]);
        }
    }

    function onDialogueSubtaskAdded(title){
        setNewTasks([...newTasks, title]);
    }

    return (
        <div className={`rounded-lg p-3 my-3 ${getThemeColor('bg-gray-200', 'bg-zinc-800')}`}>
            <div className='flex items-center justify-between mb-2'>
                <Title order={4}>Subtasks</Title>
                <SubtaskDialogue 
                    tasks={tasks?.filter((task) => task.id !== selectedTask?.id && !subtasks?.includes(task.id))} 
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