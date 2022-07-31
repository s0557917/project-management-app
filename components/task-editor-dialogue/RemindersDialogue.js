import Dialogue from "../general/dialogues/Dialogue"
import { useState } from "react";
import ReminderInput from "./ReminderInput";

export default function RemindersDialogue({remindersDialogueState, remindersDialogueCallback}) {
    
    const [remindersDialogueOpened, setRemindersDialogueOpened] = remindersDialogueState;
    const [reminders, setReminders] = useState([{
        id: 1,
        time: 30,
    }]);
    const [reminderInputs, setReminderInputs] = useState([<ReminderInput id={1} onInputChangeCallback={onInputChange}/>]);

    function formatAndSaveReminders() {
        // remindersDialogueCallback()
    }

    function onInputChange(id, value, field) {

        let newReminders = [...reminders];
        

        if(field === "time") {
            newReminders[id].time = value;
        } else if(field === "unit") {
            newReminders[id].unit = value;
        }
        setReminders(newReminders);
        console.log("Reminder input changed: ", reminders);
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
                    onClick={() => setReminderInputs([...reminderInputs, <ReminderInput id={reminderInputs.length + 1} onInputChangeCallback={onInputChange}/>])}
                >
                    +
                </button>
            </>
        </Dialogue>
    )
}