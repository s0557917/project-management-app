import ViewsTabs from "../components/general/ViewsTabs"
import EventCalendar from "../components/calendar/EventCalendar"
import sampleData from "../data/sample-tasks";
import sampleCategories from "../data/sample-categories";
import { useState } from "react";
import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue";

export default function Calendar() {

    const [sampleTasks, setSampleTasks] = useState(sampleData);
    const [selectedTask, setSelectedTask] = useState({});
    const [opened, setOpened] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');

    function onDateClicked(date){
        setSelectedDate(new Date(date.date).toLocaleString('en-GB'));
        setOpened(true);
    }

    function onTaskSaved(taskData) {
        if (!taskData.id) {
            taskData.id = Math.random().toString(36).substr(2, 9);
            setSampleTasks([...sampleTasks, taskData]);

        } else {
            let taskIndex = sampleTasks.findIndex(task => task.id === taskData.id);
            let tasksCopy = [...sampleTasks];
            let modifiedTask = {
                ...tasksCopy[taskIndex],
                title: taskData.title,
                details: taskData.details,
                dueDate: taskData.dueDate,
                timeRange: taskData.timeRange,
                category: taskData.category,
                reminders: taskData.reminders,
                priority: taskData.priority,
            }

            tasksCopy[taskIndex] = modifiedTask;
            setSampleTasks(tasksCopy);
        }

        setOpened(false);
        setSelectedTask({});
    }

    function onModalClosed() {
        setSelectedTask({});
    }

    return (
        <div>
            <ViewsTabs />
            <h1>Calendar</h1>

            <EventCalendar 
                dateClickCallback={onDateClicked}
            />

            <TaskEditorDialogue 
                tasks={sampleTasks} 
                categories={sampleCategories}
                modalState={[opened, setOpened]} 
                selectedTaskState={selectedTask}
                saveTaskCallback={onTaskSaved}
                onModalClosed={onModalClosed}
                date={selectedDate}
            />
        </div>
    )
}