import { Title } from "@mantine/core"
import SubtaskDialogue from "../sub-menus/SubtaskDialogue"
import Sublist from "./Sublist"
import getThemeColor from "../../../utils/color/getThemeColor";
import { v4 as uuidv4 } from 'uuid';

export default function SubtaskSection({ tasks, categories, selectedTask, subtasksState, newSubtasksState, modifiedSubtasksState }) {

    const [subtasks, setSubtasks] = subtasksState;
    const [newSubtasks, setNewSubtasks] = newSubtasksState;
    const [modifiedSubtasks, setModifiedSubtasks] = modifiedSubtasksState;

    const bgColor = getThemeColor('bg-gray-200', 'bg-zinc-800');

    function onSubtaskClicked(subtaskId){
        const index = modifiedSubtasks.findIndex((subtask) => subtask.id === subtaskId);
        if(index === -1){
            modifiedSubtasks.push({taskId: subtaskId, completed: !(tasks.find((task) => task.id === subtaskId).completed)});
        } else {
            modifiedSubtasks[index].completed = !(modifiedSubtasks[index].completed);
        }
    }

    function onSubtaskRemoved(subtaskId){
        const filteredNew = newSubtasks?.filter(subtask => subtask.id !== subtaskId);
        setSubtasks(subtasks?.filter(subtask => subtask !== subtaskId));
        setNewSubtasks(filteredNew);
    }

    async function onDialogueSubtaskClicked(subtask){
        setSubtasks([...subtasks, subtask]);
    }

    function onDialogueSubtaskAdded(title){      
        setNewSubtasks([...newSubtasks, {id: uuidv4(), title: title, categoryId: null }]);
    }

    return (
        <div className={`rounded-lg p-3 my-3 ${bgColor}`}>
            <div className='flex items-center justify-between mb-2'>
                <Title order={4}>Subtasks</Title>
                <SubtaskDialogue 
                    subtasks={tasks?.filter((task) => task.id !== selectedTask?.id && !subtasks?.includes(task.id))} 
                    categories={categories} 
                    selectedTask={selectedTask}
                    onSubtaskClicked={onDialogueSubtaskClicked}
                    onSubtaskAdded={onDialogueSubtaskAdded}
                />
            </div>
                <Sublist 
                    subtasks={tasks?.filter((task) => subtasks?.includes(task.id))}
                    newSubtasks={newSubtasks}
                    categories={categories}
                    onSubtaskClicked={onSubtaskClicked}
                    onSubtaskRemoved={onSubtaskRemoved}
                />
        </div>
    )
}