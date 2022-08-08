import Dialogue from "../general/dialogues/Dialogue"
import { useState, useEffect } from "react";
import ReminderInput from "./ReminderInput";

export default function RemindersDialogue({remindersDialogueState, remindersDialogueCallback, remindersState}) {

    const [remindersDialogueOpened, setRemindersDialogueOpened] = remindersDialogueState;
    const [reminders, setReminders] = useState(remindersState);
    const [reminderInputs, setReminderInputs] = useState(
        <ReminderInput 
            id={0} 
            onInputChangeCallback={onInputChange} 
            key={0}
            remindersState={remindersState}
        />
    );

    console.log("START: ", reminders, remindersState);

    // useEffect(() => {
    //     if(reminders.length < reminderInputs.length) {
    //         let expandedReminders = {...reminders};
    //         expandedReminders = {
    //             time: 30,
    //             unit: 'Minutes'
    //         }
    //         setReminders(expandedReminders);
    //     }
    // }, [reminderInputs])

    function onInputChange(id, newTime, newUnit) {
        let changedReminder = {...reminders};
        changedReminder = {time: newTime, unit: newUnit};

        setReminders(changedReminder);
    }

    return (
        <Dialogue
            opened={remindersDialogueOpened}
            onClose={() => setRemindersDialogueOpened(false)}
            title="Set reminders"
            saveButtonCallback = {() => {
                remindersDialogueCallback(reminders);
                setRemindersDialogueOpened(false);
            }}
        >
            <>
                {reminderInputs}
                {/* <button
                    className="hover:bg-cyan-700 bg-cyan-500 m-3 p-3 text-white rounded-full"
                    onClick={() => setReminderInputs(
                        [
                            ...reminderInputs, 
                            <ReminderInput 
                                id={reminderInputs.length} 
                                onInputChangeCallback={onInputChange} 
                                key={reminderInputs.length}
                            />
                        ]
                    )}
                >
                    +
                </button> */}
            </>
        </Dialogue>
    )
}