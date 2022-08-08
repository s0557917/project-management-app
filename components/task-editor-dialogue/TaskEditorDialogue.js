import { useState, useEffect } from 'react';
import { TextInput, Textarea, Title } from '@mantine/core';
import {Calendar, Flag, Tag, BellRinging } from 'phosphor-react';
import Sublist from '../task-list/Sublist';
import DateTimePickerDialogue from './DateTimePickerDialogue';
import PriorityDialogue from './PriorityDialogue';
import Dialogue from '../general/dialogues/Dialogue';
import RemindersDialogue from './RemindersDialogue';
import CategoryDialogue from './CategoryDialogue';
import IconButton from './IconButton';

export default function TaskEditorDialogue({ tasks, categories, modalState, selectedTaskState, saveTaskCallback, onModalClosed}) {
    const [opened, setOpened] = modalState;
    const [taskTitle, setTaskTitle] = useState(selectedTaskState.title);
    const [taskDetails, setTaskDetails] = useState(selectedTaskState.details);

    const [dateTimeDialogOpened, setDateTimeDialogOpened] = useState(false);
    const [priorityDialogueOpened, setPriorityDialogueOpened] = useState(false);
    const [remindersDialogueOpened, setRemindersDialogueOpened] = useState(false);
    const [categoryDialogueOpened, setCategoryDialogueOpened] = useState(false);

    const [pickedDate, setPickedDate] = useState(new Date(selectedTaskState.dueDate).toLocaleString('en-GB') || '');
    const [pickedTimeRange, setPickedTimeRange] = useState(selectedTaskState.timeRange || [null, null]);
    const [pickedPriority, setPickedPriority] = useState(selectedTaskState.priority || 1);
    const [pickedReminders, setPickedReminders] = useState(selectedTaskState.reminders || []);
    const [pickedCategory, setPickedCategory] = useState(selectedTaskState.category || '');
    const [userTimezone, setUserTimezone] = useState(selectedTaskState.timeZone || null);

    function dateTimePickerCallback(date, timeRange, userTimezone) {
        setPickedDate(date);
        setPickedTimeRange(timeRange);
        setUserTimezone(userTimezone);

        console.log(date, timeRange, userTimezone);

        setDateTimeDialogOpened(false);

    }

    useEffect(() => {
        setTaskTitle(selectedTaskState.title);
        setTaskDetails(selectedTaskState.details);
        setPickedCategory(selectedTaskState.category || '');
        setPickedTimeRange(selectedTaskState.timeRange || [null, null]);
        setPickedDate(selectedTaskState.dueDate || null);
        setPickedPriority(selectedTaskState.priority || 1);
        setPickedReminders(selectedTaskState.reminders || {"time": 3, "unit": "Days"});
        setUserTimezone(selectedTaskState.timeZone || null);
    }, [selectedTaskState]);

    return (
        <Dialogue
            opened={opened}
            onClose={() => {
                setOpened(false);
                onModalClosed();
            }}
            title="Add or edit your task"
            saveButtonCallback={() => {
                saveTaskCallback({
                    id: (selectedTaskState ? selectedTaskState.id : ''),  
                    title: taskTitle,
                    details: taskDetails,
                    dueDate: pickedDate,
                    timeRange: pickedTimeRange,
                    category: pickedCategory,
                    reminders: pickedReminders,
                    priority: pickedPriority,
                });
            }}
        >
            <>
                <TextInput
                    label="Task Title"
                    placeholder="Enter a title for your task"
                    required
                    value={taskTitle}
                    onChange={(event) => setTaskTitle(event.currentTarget.value)}
                />

                <Textarea 
                    label="Task Details"
                    placeholder="Enter details for your task"
                    required
                    value={taskDetails}
                    onChange={(e) => setTaskDetails(e.target.value) }
                />

                <div className="inset-y-0 right-0 flex items-center m-1 justify-items-end">

                    <IconButton
                        state={pickedDate 
                            ? new Date(pickedDate).toLocaleDateString('en-GB')
                            : undefined
                        }
                        buttonCallback={() => setDateTimeDialogOpened(true)}
                    >
                        <Calendar size={28} className="m-1"/>
                    </IconButton>

                    <IconButton
                        state={pickedPriority}
                        buttonCallback={() => setPriorityDialogueOpened(true)}
                    >
                        <Flag size={28} className="m-1"/>
                    </IconButton>

                    <IconButton
                        state={categories.find(category => category.id === pickedCategory)?.name}
                        buttonCallback={() => setCategoryDialogueOpened(true)}
                    >
                        <Tag size={28} className="m-1"/>
                    </IconButton>

                    <IconButton
                        buttonCallback={() => setRemindersDialogueOpened(true)}
                    >
                        <BellRinging size={28} className="m-1"/>
                    </IconButton>
                    <br/>
                </div>

                <DateTimePickerDialogue dateTimeDialogState={[ dateTimeDialogOpened, setDateTimeDialogOpened ]} dateTimePickerCallback={dateTimePickerCallback} dateState={pickedDate} timeRangeState={pickedTimeRange} timeZoneState={userTimezone}/>
                <PriorityDialogue priorityDialogueState={[ priorityDialogueOpened, setPriorityDialogueOpened ]} priorityDialogueCallback={setPickedPriority} priorityState={pickedPriority}/>
                <RemindersDialogue remindersDialogueState={[remindersDialogueOpened, setRemindersDialogueOpened]} remindersDialogueCallback={setPickedReminders} remindersState={pickedReminders}/>
                <CategoryDialogue categoryDialogueState={[categoryDialogueOpened, setCategoryDialogueOpened]} category={pickedCategory} categoryDialogueCallback={setPickedCategory} categories={categories}/>

                <Title order={4}>Subtasks</Title>
                <Sublist tasks={tasks?.filter((task) => selectedTaskState?.subtasks?.includes(task.id))}/>
            </>
        </Dialogue>
    );

}