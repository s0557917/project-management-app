import { Circle, X } from "phosphor-react";
import { ActionIcon } from "@mantine/core";

export default function Subtask({ task, categories, onSubtaskClicked, textSize, circleSize, removable, onSubtaskRemoved }) {
    return(
        <li 
            className={`flex items-center justify-between p-2 m-1 bg-zinc-700 rounded-sm cursor-pointer ${textSize}`}
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
                {task.title}
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