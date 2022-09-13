import { Circle, X } from "phosphor-react";
import { ActionIcon } from "@mantine/core";
import getThemeColor from "../../../utils/color/getThemeColor";
import { useState } from "react";

export default function Subtask({ task, categories, onSubtaskClicked, textSize, circleSize, removable, onSubtaskRemoved }) {
    const textColor = getThemeColor('text-gray-900', 'text-white');
    const divColors = getThemeColor('bg-gray-200 border-y-gray-300', 'bg-zinc-800 border-y-neutral-600');
    const [hovered, setHovered] = useState(false);

    return(
        <div className="relative">
            <li 
                className={`flex items-center justify-between p-2 mx-1 rounded-sm border-y ${textSize} ${divColors}`}
                >
                <div
                    onClick={() => onSubtaskClicked(task.id)} 
                    className="flex items-center grow"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
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
            {
                task.completed && 
                <div className={`scale-95 transition-all absolute top-2/4 left-0 border-b ${getThemeColor('border-b-black', 'border-b-gray-300')} w-full content-none`}></div>
            }
        </div>
    )
}