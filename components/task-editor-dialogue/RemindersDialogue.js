import Dialogue from "../general/dialogues/Dialogue"
import { useState, useEffect } from "react";
import ReminderInput from "./ReminderInput";

export default function RemindersDialogue({remindersDialogueState, remindersDialogueCallback}) {

    const [remindersDialogueOpened, setRemindersDialogueOpened] = remindersDialogueState;
    const [reminders, setReminders] = useState([{
        id: 1,
        time: 30,
        unit: 'Minutes'
    }]);
    const [reminderInputs, setReminderInputs] = useState([<ReminderInput id={1} onInputChangeCallback={onInputChange} key={1}/>]);

    function formatAndSaveReminders() {
        // remindersDialogueCallback()
    }

    function onReminderAdded(id) {
        console.log("Start: ", reminders)
        let newReminders = [...reminders];
        newReminders.push({
            id: id,
            time: 30,
            unit: 'Minutes'
        });
        setReminders(newReminders);
        console.log("NEW: ",reminders)
    }

    useEffect(() => {
        console.log('REM UP', reminders);
      }, [reminders])

    function onInputChange(id, value, field) {

        // console.log("id: ", id, "value: ", value, "field: ", field);

        // console.log("REM: ", reminders);
        let newReminders = [...reminders];
        // console.log("TEST", reminders[0].id, id, reminders[0].id === parseInt(id, 10))
        console.log("REM: ", reminders);
        reminders.forEach(reminder => {
            console.log("TEST FE", reminder.id, id, reminder.id === parseInt(id, 10))
            // reminder.id === parseInt(id, 10);
        });
        // console.log("NEW: ", newReminders);

        // if(id <= reminders.length) {
        //     let modifiedReminder = {
        //         ...reminders[index],
        //         [field]: value
        //     }

        //     newReminders[index] = modifiedReminder;

        // }

        

        // if(field === "time" && newReminders[id]) {
        //     newReminders[id].time = value;
        // } else if(field === "unit" && newReminders[id]) {
        //     newReminders[id].unit = value;
        // }
        // setReminders(newReminders);
        // console.log("Reminder input changed: ", reminders);
    }

    return (
        <Dialogue
            opened={remindersDialogueOpened}
            onClose={() => setRemindersDialogueOpened(false)}
            title="Set reminders"
            saveButtonCallback = {() => formatAndSaveReminders()}
        >
            <>
                {reminderInputs}
                <button
                    className="hover:bg-cyan-700 bg-cyan-500 m-3 p-3 text-white rounded-full"
                    onClick={() => {
                        setReminderInputs([...reminderInputs, <ReminderInput id={reminderInputs.length + 1} onInputChangeCallback={onInputChange} key={reminderInputs.length + 1}/>]);
                        onReminderAdded(reminderInputs.length + 1)
                    }}
                >
                    +
                </button>
            </>
        </Dialogue>
    )
}