import { NumberInput, NativeSelect } from "@mantine/core";
import { useState, useEffect } from "react";

export default function ReminderInput({id, onInputChangeCallback, remindersState}) {
    
    console.log("REMINDER STATE: ", remindersState);
    const [time, setTime] = useState(remindersState?.time || 30);
    const [unit, setUnit] = useState(remindersState?.unit || 'Minutes');
    
    useEffect(() => {
        onInputChangeCallback(id, time, unit);
    }, [time, unit])

    return (
        <div className="flex">
            <p className="m-5">Remind me </p>
            <NumberInput
                value={time}
                onChange={(value) => setTime(value)}
            />
            <NativeSelect
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                data={[ 'Minutes', 'Hours', 'Days', 'Weeks' ]}
            />
            <p className="m-5">before!</p>            
        </div>
    )
}