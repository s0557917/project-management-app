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
                start: taskData.start,
                end: taskData.end,
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

    function onDateClicked(date){
        setSelectedDate(new Date(date));
        setOpened(true);
    }

    function onTaskClicked(task){
        setSelectedTask(task);
        setOpened(true);
    }

    function onTaskDropped(droppedCalendarTask){

        console.log("START: ", droppedCalendarTask.start, " -- ", droppedCalendarTask.end)

        let droppedTask = sampleTasks.find(task => task.id === droppedCalendarTask.id);
        let taskIndex = sampleTasks.findIndex(task => task.id === droppedTask.id);

        if(droppedTask.dueDate && droppedTask.start && droppedTask.end){
            let tasksCopy = [...sampleTasks];
            let modifiedTask = {
                ...tasksCopy[taskIndex],
                dueDate: droppedCalendarTask.start,
                start: droppedCalendarTask.start,
                end: droppedCalendarTask.end
            }
            tasksCopy[taskIndex] = modifiedTask;
            console.log("---TIMED EVENT", tasksCopy, '⁄n', sampleTasks)
            setSampleTasks(tasksCopy);
        } else if(droppedTask.dueDate && (!droppedTask.start  && !droppedTask.end)){
            let tasksCopy = [...sampleTasks];
            let modifiedTask = {
                ...tasksCopy[taskIndex],
                dueDate: droppedCalendarTask.start,
            }
            tasksCopy[taskIndex] = modifiedTask;
            console.log("---ALL DAY EVENT", tasksCopy, '⁄n', sampleTasks)
            setSampleTasks(tasksCopy);
        }
        
    }

    function onModalClosed() {
        setSelectedTask({});
    }

    return (
        <div className="p-5 h-screen">
            <ViewsTabs />
            <h1>Calendar</h1>

            <EventCalendar 
                events={sampleTasks}
                categories={sampleCategories}
                dateClickCallback={onDateClicked}
                taskClickCallback={onTaskClicked}
                taskDroppedCallback={onTaskDropped}
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