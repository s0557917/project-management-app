import { Circle } from "phosphor-react";
import { Checkbox } from "@mantine/core";
import { useState } from "react";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function CategoryFilter ({category, circleSize, onCategoryStatusChanged, textSize, completed}) {
    
    const [checked, setChecked] = useState(completed);
    const backgroundColor = getThemeColor('bg-gray-200', 'bg-neutral-600');

    return (
        <li 
            key={`category-${category}`}
            className={`flex items-center justify-between p-2 m-1 rounded-sm ${textSize} ${backgroundColor}`}
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
                color="green"
            />
        </li>
    )
}