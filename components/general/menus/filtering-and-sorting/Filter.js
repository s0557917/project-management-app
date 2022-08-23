import { Checkbox } from "@mantine/core";
import { useState } from "react";
import getThemeColor from "../../../../utils/color/getThemeColor";

export default function Filter({filterName, textSize, onFilterStatusChanged, active}) {
    const [checked, setChecked] = useState(active);

    return (
        <li className={`flex items-center justify-between p-2 m-1 rounded-sm cursor-pointer ${textSize} ${getThemeColor('bg-gray-200', 'bg-zinc-800')}`}>
            <div
                className="flex items-center grow"
            >
                {filterName}
            </div>
            <Checkbox 
                key={filterName}
                checked={checked} 
                onChange={(event) => {
                    setChecked(event.currentTarget.checked);
                    onFilterStatusChanged(filterName, event.currentTarget.checked);
                }}
            />
        </li>
    )
}