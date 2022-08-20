import { Checkbox } from "@mantine/core";
import { useState } from "react";

export default function Filter({filterName, textSize, onFilterStatusChanged, active}) {
    const [checked, setChecked] = useState(active);

    return (
        <li className={`flex items-center justify-between p-2 m-1 bg-zinc-700 rounded-sm cursor-pointer ${textSize}`}>
            <div
                className="flex items-center grow"
            >
                {filterName}
            </div>
            <Checkbox 
                checked={checked} 
                onChange={(event) => {
                    setChecked(event.currentTarget.checked);
                    onFilterStatusChanged(filterName, event.currentTarget.checked);
                }}
            />
        </li>
    )
}