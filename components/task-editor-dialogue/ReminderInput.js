import { NumberInput, NativeSelect } from "@mantine/core";

export default function ReminderInput({id, onInputChangeCallback}) {
    return (
        <div className="flex">
            <p>Remind me </p>
            <NumberInput
                defaultValue={30}
                onChange={(value) => onInputChangeCallback(id, value, "time")}
            />
            <NativeSelect
                onChange={(event) => onInputChangeCallback(id, event.currentTarget.value, "unit")}
                data={[ 'Minutes', 'Hours', 'Days', 'Weeks' ]}
            />
            <p>before!</p>            
        </div>
    )
}