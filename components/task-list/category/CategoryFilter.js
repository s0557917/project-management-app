import { Circle } from "phosphor-react";
import { Checkbox } from "@mantine/core";
import { useState } from "react";

export default function CategoryFilter ({category, circleSize, onCategoryStatusChanged, textSize, completed}) {
    
    const [checked, setChecked] = useState(completed);

    return (
        <li 
            className={`flex items-center justify-between p-2 m-1 bg-zinc-700 rounded-sm ${textSize}`}
        >
            <div
                className="flex items-center grow"
            >
                <Circle 
                    size={circleSize} 
                    color={ category.color } 
                    weight="fill" 
                    className='mr-2'
                />
                {category.name}
            </div>
            <Checkbox 
                checked={checked} 
                onChange={(event) => {
                    setChecked(event.currentTarget.checked);
                    onCategoryStatusChanged(category, event.currentTarget.checked);
                }}
            />
        </li>
    )
}