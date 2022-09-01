import { Circle, X } from "phosphor-react";
import { ActionIcon } from "@mantine/core";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function Subtask({ task, categories, onSubtaskClicked, textSize, circleSize, removable, onSubtaskRemoved }) {
    const textColor = getThemeColor('text-gray-900', 'text-white');
    const borderColor = getThemeColor('bg-gray-200 border-y-gray-300', 'bg-zinc-800 border-y-neutral-600');

    return(
        <li 
            className={`flex items-center justify-between p-2 mx-1 rounded-sm cursor-pointer border-y ${textSize} ${borderColor}`}
        >
            <div
                onClick={() => onSubtaskClicked(task.id)} 
                className="flex items-center grow"
            >
                <Circle 
                    size={circleSize} 
                    color={ task.categoryId !== '' && task.categoryId !== null 
                        ? categories.find((category) => category.id === task.categoryId).color  
                        : "#a39d9d"
                    } 
                    weight="fill" 
                    className='mr-2'
                />
                <p className={textColor}>{task.title}</p>
            </div>
            { 
                removable &&
                <ActionIcon onClick={() => onSubtaskRemoved(task.id)}>
                    <X size={18} color="#cd3737" weight="bold"/>
                </ActionIcon>
            }
        </li>
    )
}