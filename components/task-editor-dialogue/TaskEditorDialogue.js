import { useState, useEffect } from 'react';
import { TextInput, Textarea, Title } from '@mantine/core';
import {Calendar, Flag, Tag, BellRinging } from 'phosphor-react';
import SubtaskSection from './sub-menus/SubtaskSection';
import DateTimePickerDialogue from './sub-menus/DateTimePickerDialogue';
import PriorityDialogue from './sub-menus/PriorityDialogue';
import Dialogue from '../general/dialogues/Dialogue';
import RemindersDialogue from './sub-menus/RemindersDialogue';
import CategoryDialogue from './sub-menus/CategoryDialogue';
import IconButton from '../general/icons/IconButton';

export default function TaskEditorDialogue({ tasks, categories, modalState, selectedTask, selectedTaskSetter, saveEditedTaskCallback, saveNewTaskCallback, onModalClosed, date }) {

    const [opened, setOpened] = modalState;
    const [taskTitle, setTaskTitle] = useState(selectedTask?.title || '');
    const [taskDetails, setTaskDetails] = useState(selectedTask?.details || '');

    const [dateTimeDialogOpened, setDateTimeDialogOpened] = useState(false);
    const [priorityDialogueOpened, setPriorityDialogueOpened] = useState(false);
    const [remindersDialogueOpened, setRemindersDialogueOpened] = useState(false);
    const [categoryDialogueOpened, setCategoryDialogueOpened] = useState(false);
    
    const [dueDate, setDueDate] = useState(() => {
        if(selectedTask?.dueDate && !isNaN(new Date(selectedTask?.dueDate))){
            return new Date(selectedTask?.dueDate);
        } else if(date && !isNaN(new Date(date))){
            return new Date(date);
        } else {
            return null;
        }
    });
    const [startPoint, setStartPoint] = useState(new Date(selectedTask?.start) || null);
    const [endPoint, setEndPoint] = useState(selectedTask?.end || null);
    const [pickedPriority, setPickedPriority] = useState(selectedTask?.priority || 1);
    const [pickedReminders, setPickedReminders] = useState(selectedTask?.reminders || []);
    const [pickedCategory, setPickedCategory] = useState(selectedTask?.categoryId || '');
    const [userTimezone, setUserTimezone] = useState(selectedTask?.timeZone || null);
    const [subtasks, setSubtasks] = useState(selectedTask?.subtasks || []);

    useEffect(() => {
        setTaskTitle(selectedTask?.title || '');
        setTaskDetails(selectedTask?.details || '');
        setPickedCategory(selectedTask?.categoryId || '');
        setDueDate(() => {
            if(selectedTask?.dueDate && !isNaN(new Date(selectedTask?.dueDate))){
                return new Date(selectedTask?.dueDate);
            } else if(date && !isNaN(new Date(date))){
                return new Date(date);
            } else {
                return null;
            }
        });
        setStartPoint(selectedTask?.start || null);
        setEndPoint(selectedTask?.end || null);
        setPickedPriority(selectedTask?.priority || 1);
        setPickedReminders(selectedTask?.reminders || {"time": 3, "unit": "Days"});
        setUserTimezone(selectedTask?.timeZone || null);
        setSubtasks(selectedTask?.subtasks);
    }, [selectedTask, date]);

    function dateTimePickerCallback(dueDate, start, end, userTimezone) {
        setDueDate(dueDate);
        if(start !== null && end !== null) {
            setStartPoint(start);
            setEndPoint(end);
        }
        setUserTimezone(userTimezone);
        setDateTimeDialogOpened(false);
    }

    function onSaveButtonClicked(){
        const taskData = {
            title: taskTitle,
            details: taskDetails,
            completed: selectedTask.completed || false,
            dueDate: dueDate,
            start: startPoint,
            end: endPoint,
            categoryId: pickedCategory,
            reminders: pickedReminders,
            priority: pickedPriority,
            subtasks: subtasks || [],
        }
        if(selectedTask.id){
            saveEditedTaskCallback(taskData, selectedTask.id);
        } else {
            saveNewTaskCallback(taskData);
        }
    }

    return (
        <Dialogue
            opened={opened}
            onClose={() => {
                setOpened(false);
                onModalClosed();
            }}
            title="Add or edit your task"
            saveButtonCallback={() => onSaveButtonClicked()}
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
                        state={dueDate 
                            ? new Date(dueDate).toLocaleDateString('en-GB')
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
                        state={categories?.find(category => category.id === pickedCategory)?.name}
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

                <DateTimePickerDialogue 
                    dateTimeDialogState={[ dateTimeDialogOpened, setDateTimeDialogOpened ]} 
                    dateTimePickerCallback={dateTimePickerCallback} 
                    dueDate={dueDate} 
                    startPoint={startPoint} 
                    endPoint={endPoint} 
                    timeZoneState={userTimezone}
                />
                <PriorityDialogue 
                    priorityDialogueState={[ priorityDialogueOpened, setPriorityDialogueOpened ]} 
                    priorityDialogueCallback={setPickedPriority} 
                    priorityState={pickedPriority}
                />
                <RemindersDialogue 
                    remindersDialogueState={[remindersDialogueOpened, setRemindersDialogueOpened]} 
                    remindersDialogueCallback={setPickedReminders} 
                    remindersState={pickedReminders}
                />
                <CategoryDialogue 
                    categoryDialogueState={[categoryDialogueOpened, setCategoryDialogueOpened]} 
                    category={pickedCategory} 
                    categoryDialogueCallback={setPickedCategory} 
                    categories={categories}
                />

                <SubtaskSection 
                    tasks={tasks} 
                    categories={categories} 
                    selectedTask={selectedTask} 
                    selectedTaskSetter={selectedTaskSetter}
                    subtasksState={[subtasks, setSubtasks]}
                />
            </>
        </Dialogue>
    );

}