import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from 'react';
import { filterTasksToUserPreferences } from '../../utils/task-filtering/taskFiltering';
import { useQuery } from '@tanstack/react-query';
import { getFilters } from '../../utils/db/queryFunctions/settings';
import CalendarSkeleton from '../general/loading/CalendarSkeleton';

export default function EventCalendar({tasks, categories, dateClickCallback, taskClickCallback, taskDroppedCallback, isFetchingTasks, isFetchingCategories}) {
  
  const {data: filters, isFetching: isFetchingFilters} = useQuery(['filters'], getFilters);
  const [eventSource, setEventSource] = useState(mapEvents)

  useEffect(() => {
    setEventSource(mapEvents);
  }, [tasks, categories, isFetchingTasks, isFetchingCategories]);

  function mapEvents(){
    const filteredEvents = tasks?.filter(task => filterTasksToUserPreferences(task, categories, filters));
    const mappedEvents = filteredEvents?.map(event => {
      const startTime = event.start !== '' && event.start !== null 
        ? new Date(event.start)
        : new Date(event.dueDate);
      const endTime = event.end !== '' && event.end !== null 
        ? new Date(event.end) 
        : null;
      const categoryColor =  categories?.find(category => category.id === event.categoryId)?.color || "#a39d9d";

      return {
        id: event.id,
        title: event.title,
        allDay: (event.start === '' || event.start === null) && (event.end === '' || event.end === null),
        start: startTime,
        end: endTime,
        color: categoryColor,
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
    <>
      <Calendar
          // contentHeight="auto" 
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
          headerToolbar={{
            left:'today prev,next',
            center:'title',
            right:'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          eventClick={(arg) => taskClickCallback(tasks.find((event) => event.id === arg.event.id))}
          dateClick={(arg) => {
            dateClickCallback(arg.date)
          }}
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
          dayCellClassNames={'hover:bg-green-500 hover:text-white hover:font-bold hover:text-md cursor-pointer'}
          slotLaneClassNames={'hover:bg-green-500 hover:text-white hover:font-bold cursor-pointer'}
        />
    </>
  )
}

