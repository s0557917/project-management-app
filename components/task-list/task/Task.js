import IconSection from "./IconSection"
import getThemeColor from "../../../utils/color/getThemeColor"
import { useState } from "react";
import { Trash, PencilSimple } from "phosphor-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../../../utils/db/queryFunctions/tasks";
import { Modal } from "@mantine/core";
import { updateTextEditorStructure } from "../../../utils/db/queryFunctions/textEditorStructure";

export default function Task({ taskData, onTaskClicked, onCompletionStateChanged, category, indent }) {
    
    const [displayDeleteIcon, setDisplayDeleteIcon] = useState(false);
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

    const textColor = getThemeColor('text-gray-900', 'text-white');
    const queryClient = useQueryClient();

    const updateTextEditorStructureMutation = useMutation(
        (taskId) => updateTextEditorStructure({taskId, action: 'delete'}),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('textEditorStructure');
            }
        }
    )

    const deleteTaskMutation = useMutation(
        (taskId) => deleteTask(taskId),
        {
            onSuccess: (data) => {
                console.log("--- Deleted task with id: " + data.id);
                queryClient.invalidateQueries('tasks');
                updateTextEditorStructureMutation.mutate(data.id);
            }
        }
    )

    function onDeleteTask() {
        setIsDeleteTaskModalOpen(false);
        deleteTaskMutation.mutate(taskData.id);
    }

    return(
        <div className={`relative ${indent ? 'ml-14' : ''}`}>
            <div
                onMouseEnter={() => setDisplayDeleteIcon(true)}
                onMouseLeave={() => setDisplayDeleteIcon(false)} 
                className={`flex items-center border-y ${getThemeColor('bg-gray-200 hover:bg-gray-300 hover:rounded-sm border-y-gray-300', 'border-y-neutral-600 hover:bg-neutral-700 hover:rounded-sm relative')}`}
            >
                <div>
                    <button 
                        className={`rounded-full w-7 h-7 mx-3 ${taskData.completed ? "bg-green-500 hover:bg-green-300 hover:border-white hover:border-2" : "bg-red-600 hover:bg-red-400 hover:border-white hover:border-2"}`}
                        onClick={() => {
                            onCompletionStateChanged(taskData.id, !taskData.completed)
                        }}
                    >   
                    </button>
                </div>
                <div 
                    className="h-16 w-full"
                >
                    <div className="h-full flex justify-between items-center">

                        <div 
                            className="items-center m-1 h-auto grow-1 flex"
                        >
                            <div className="flex items-center">
                                <div>
                                    <p className={` text-sm pb-0.5 font-bold ${textColor}`}>{taskData.title}</p>
                                    <p className={`text-xs font-light ${textColor}`}>{
                                        taskData.details?.length > 15 ? `${taskData.details.substring(0, 15)}...` : taskData.details
                                    }</p>
                                </div>
                                {
                                    displayDeleteIcon &&                             
                                    <div className="ml-2 flex">
                                        <button onClick={() => onTaskClicked(taskData)} className="hover:scale-105 active:scale-95">
                                            <PencilSimple size={20} color='#16a34a' weight="regular" />
                                        </button>
                                        <button onClick={() => setIsDeleteTaskModalOpen(true)} className="hover:scale-105 active:scale-95">
                                            <Trash size={20} color="#16a34a" weight="regular"  />
                                        </button>
                                    </div>
                                }
                            </div> 
                        </div>
                        <IconSection 
                            taskData={taskData}
                            category={category}
                            textColor={textColor}
                        />

                    </div>
                </div>

                <Modal
                    opened={isDeleteTaskModalOpen}
                    onClose={() => setIsDeleteTaskModalOpen(false)}
                    withCloseButton={false}
                    centered
                >
                    <div className="mb-4">
                        <h1>Caution!</h1>
                        <h2>You are about to delete the <span className="font-bold">{taskData.title}</span> task!</h2>
                    </div>
                    <div className="flex items-center justify-evenly">
                        <button
                            className={`hover:scale-105 active:scale-95 cursor-pointer transition-al p-2 bg-green-500 text-white rounded-md`}
                            onClick={() => onDeleteTask()}
                        >
                            Go ahead!
                        </button>

                        <button
                            className={`hover:scale-105 active:scale-95 cursor-pointer transition-al p-2 bg-red-500 text-white rounded-md`}
                            onClick={() => setIsDeleteTaskModalOpen(false)}
                        >
                            Don't do it!
                        </button>
                    </div>
                </Modal>
            </div>
            {
                taskData.completed &&
                <div className={`absolute top-2/4 left-0 border-b ${getThemeColor('border-b-black', 'border-b-gray-300')} w-full content-none`}></div>
            }
        </div>
    )
}