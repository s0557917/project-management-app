import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from 'react';

export default function EventCalendar({tasks, categories, dateClickCallback, taskClickCallback, taskDroppedCallback, activeCategories, displaySettings}) {

  const [eventSource, setEventSource] = useState(mapEvents)

  useEffect(() => {
    setEventSource(mapEvents)
  }, [tasks, activeCategories, displaySettings, categories]);

  function mapEvents(){
    const filteredEvents = tasks?.filter(event => 
      (event.dueDate !== null && event.dueDate !== undefined && event.dueDate != '') 
      && 
      (
        (
          event.categoryId !== null 
          && event.categoryId !== undefined 
          && event.categoryId !== '' 
          && activeCategories?.find(activeCategory => activeCategory.id === event.categoryId)?.active
          ) 
        || 
        (
          (
            event.categoryId === null
            || event.categoryId === undefined
            || event.categoryId === ''
          )
          && displaySettings.find(setting => setting.label === 'Uncategorized')?.value
        )
      )
      // event.dueDate !== '' 
      // && (event.categoryId !== '' && event.categoryId !== null && activeCategories.find(category => category.id === event.categoryId).active)
      
    )
    const mappedEvents = filteredEvents.map(event => {
      const startTime = event.start !== '' && event.start !== null 
        ? new Date(event.start)
        : new Date(event.dueDate);
      const endTime = event.end !== '' && event.end !== null 
        ? new Date(event.end) 
        : null;
      const categoryColor = categories?.find(category => category.id === event.categoryId)?.color || "#a39d9d";
      
      return {
        id: event.id,
        title: event.title,
        allDay: (event.start === '' || event.start === null) && (event.end === '' || event.end === null),
        start: startTime,
        end: endTime,
        color: categoryColor
      }
    });
    return mappedEvents;
  }

  function onTaskDropped(droppedCalendarTask){
    let droppedTask = tasks.find(task => task.id === droppedCalendarTask.id);
    let taskIndex = tasks.findIndex(task => task.id === droppedTask.id);

    if(droppedTask.dueDate && droppedTask.start && droppedTask.end){
        let tasksCopy = [...tasks];
        let modifiedTask = {
            ...tasksCopy[taskIndex],
            dueDate: droppedCalendarTask.start,
            start: droppedCalendarTask.start,
            end: droppedCalendarTask.end
        };
        taskDroppedCallback(modifiedTask);
    } else if(droppedTask.dueDate && (!droppedTask.start  && !droppedTask.end)){
        let tasksCopy = [...tasks];
        let modifiedTask = {
            ...tasksCopy[taskIndex],
            dueDate: droppedCalendarTask.start,
        };
        taskDroppedCallback(modifiedTask);
    }
  }

  return (
    <Calendar 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
      headerToolbar={{
        left:'today prev,next',
        center:'title',
        right:'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      eventClick={(arg) => taskClickCallback(tasks.find((event) => event.id === arg.event.id))}
      dateClick={(arg) => dateClickCallback(arg.date)}
      initialView="dayGridMonth" 
      events={eventSource}
      eventTimeFormat={
        {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
        }
      }
      editable={true}
      eventDrop={(args) => onTaskDropped(args.event)}
      buttonText={{
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
        prev: '<',
        next: '>',
      }}
      locale={'en-gb'}
      nowIndicator={true}
      height={'85%'}
    />
    );
}

