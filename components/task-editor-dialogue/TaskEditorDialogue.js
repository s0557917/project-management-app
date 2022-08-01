import { useState } from 'react';
import { Modal, Group, TextInput, Textarea, Title } from '@mantine/core';
import {Calendar, Flag, Tag, BellRinging, createStyles } from 'phosphor-react';
import sampleSubtaskData from '../../data/sample-subtasks'; 
import Sublist from '../task-list/Sublist';
import DateTimePickerDialogue from './DateTimePickerDialogue';
import PriorityDialogue from './PriorityDialogue';
import Dialogue from '../general/dialogues/Dialogue';
import RemindersDialogue from './RemindersDialogue';

export default function TaskEditorDialogue({ tasks, modalState, selectedTaskState, saveTaskCallback}) {
    const [opened, setOpened] = modalState;
    const [selectedTask, setSelectedTask] = selectedTaskState;
    const [taskName, setTaskName] = useState(selectedTask.name);
    const [taskDetails, setTaskDetails] = useState(selectedTask.details);

    const [dateTimePickerOpened, setDateTimePickerOpened] = useState(false);
    const [priorityDialogueOpened, setPriorityDialogueOpened] = useState(false);
    const [remindersDialogueOpened, setRemindersDialogueOpened] = useState(false);

    function dateTimePickerCallback(date, timeFrame) {
        console.log("DATE: ", date, " - ", timeFrame);
        setDateTimePickerOpened(false);
    }

    function prioritySelectedCallback(priority) {
        console.log("Priority selected: ", priority);
    }

    function remindersSelectedCallback(reminders) {
        console.log("Reminders selected: ", reminders);
    }

    return (
        <Dialogue
            opened={opened}
            onClose={() => {
                setOpened(false);
                setSelectedTask({});
            }}
            title="Add or edit your task"
            saveButtonCallback={() => saveTaskCallback({
                title: taskName,
                details: taskDetails,
            })}
        >
                        <>
                <TextInput
                    label="Task Title"
                    placeholder="Enter a title for your task"
                    required
                    value={selectedTask ? selectedTask.title : undefined}
                    onChange={(e) => setTaskName(e.target.value) }
                />

                <Textarea 
                    label="Task Details"
                    placeholder="Enter details for your task"
                    required
                    value={selectedTask ? selectedTask.details : undefined}
                    onChange={(e) => setTaskDetails(e.target.value) }
                />

                <div class="inset-y-0 right-0 flex items-center m-1 justify-items-end">
                    <button onClick={() => setDateTimePickerOpened(true)}>
                        <Calendar size={28} class="m-1"/>
                    </button>
                    <button onClick={() => setPriorityDialogueOpened(true)}>
                        <Flag size={28} class="m-1"/>
                    </button>
                    <button>
                        <Tag size={28} class="m-1"/>
                    </button>
                    <button onClick={() => setRemindersDialogueOpened(true)}>
                        <BellRinging size={28} class="m-1"/>
                    </button>
                    <br/>
                </div>

                <DateTimePickerDialogue dateTimePickerState={[ dateTimePickerOpened, setDateTimePickerOpened ]} dateTimePickerCallback={dateTimePickerCallback}/>
                <PriorityDialogue priorityDialogueState={[ priorityDialogueOpened, setPriorityDialogueOpened ]} priorityDialogueCallback={prioritySelectedCallback}/>
                <RemindersDialogue remindersDialogueState={[remindersDialogueOpened, setRemindersDialogueOpened]} remindersDialogueCallback={remindersSelectedCallback}/>

                <Title order={4}>Subtasks</Title>
                <Sublist tasks={tasks?.filter((task) => selectedTask?.subtasks?.includes(task.id))}/>
            </>
        </Dialogue>
    );

}