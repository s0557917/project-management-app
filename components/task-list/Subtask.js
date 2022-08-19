import { Circle } from "phosphor-react";

export default function Subtask({ task, categories, onSubtaskClicked, textSize, circleSize, removable}){
    return(
        <li 
            className={`flex p-2 m-1 bg-zinc-700 rounded-sm cursor-pointer ${textSize}`}
            onClick={() => onSubtaskClicked(task.id)}
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
        </li>
    )
}